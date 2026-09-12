import mongoose from "mongoose";
import articlesServices from "../Services/articles.services.js";
import { uploadToCloudinary } from "../utils/cloudinaryTask.js";
import commentServices from "../Services/comment.services.js";
import userServices from "../Services/user.services.js";
import { newArticleEmail } from "../emailformats/articleEmail.js";
import sendEmail from "../utils/sendemail.js";


export const create_article = async (req, res) => {
    try {
        const user_id = req.curr_user.id;
        const { title, shortDescription, detailsDescription, tag, image_url } = req.body;
        const banner = req.file;

        //  Validate required fields
        if (!title || !shortDescription || !detailsDescription || !tag) {
            return res.status(400).json({
                success: false,
                message: "ALL FIELDS REQUIRED"
            });
        }

        // Validate tag
        const validTags = [
            "technology",
            "code",
            "health",
            "finance",
            "education",
            "lifestyle",
            "entertainment",
            "sports",
            "travel",
            "food",
            "business"
        ];
        if (typeof tag !== "string" || !validTags.includes(tag.trim().toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: "INVALID TAG"
            });
        }

        // Validate user ID
        if (!mongoose.isValidObjectId(user_id)) {
            return res.status(400).json({
                success: false,
                message: "INVALID USER ID"
            });
        }

        //  Validate title
        const trimmedTitle = title.trim();
        if (trimmedTitle.length < 5 || trimmedTitle.length > 150) {
            return res.status(400).json({
                success: false,
                message: "TITLE MUST BE BETWEEN 5 AND 150 CHARACTERS"
            });
        }

        //  Check duplicate article
        const existingArticle = await articlesServices.getByFields({
            title: trimmedTitle,
            createdBy: user_id
        });
        if (existingArticle) {
            return res.status(409).json({
                success: false,
                message: "ALREADY CREATED AN ARTICLE WITH THIS TITLE"
            });
        }

        //  Validate short description
        const trimmedShortDescription = shortDescription.trim();

        if (trimmedShortDescription.length < 10 || trimmedShortDescription.length > 500
        ) {
            return res.status(400).json({
                success: false,
                message: "SHORT DESCRIPTION MUST BE BETWEEN 10 AND 500 CHARACTERS"
            });
        }

        //  Validate banner
        if (banner) {
            if (banner.size > 5 * 1024 * 1024) {
                return res.status(400).json({
                    success: false,
                    message: "BANNER TOO LARGE. MAXIMUM SIZE IS 5MB"
                });
            }
            if (!["image/jpeg", "image/png"].includes(banner.mimetype)) {
                return res.status(400).json({
                    success: false,
                    message: "INVALID BANNER FORMAT. ONLY JPEG AND PNG ARE ALLOWED"
                });
            }
        }

        // Upload banner
        let banner_url = null;
        if (image_url) {
            banner_url = image_url
        } else if (banner) {
            const uploadedFile = await uploadToCloudinary(banner.buffer, "articles");
            banner_url = uploadedFile.secure_url || uploadedFile.url;
        }

        // Prepare article data
        const data = {
            title: trimmedTitle,
            shortDescription: trimmedShortDescription,
            detailsDescription: detailsDescription.trim(),
            banner: banner_url,
            tag: tag.trim(),
            createdBy: user_id
        };

        // Create article
        const response = await articlesServices.createArticle(data);

        // Return response immediately so frontend doesn't hang or timeout
        res.status(201).json({
            success: true,
            message: "ARTICLE CREATED ✅",
            data: response,
        });

        // Send email notifications asynchronously in background
        (async () => {
            try {
                const users = await userServices.allUsersEmail();
                if (users && users.length > 0) {
                    const email_info = newArticleEmail(response);
                    const emailResults = await Promise.allSettled(
                        users.map((user) =>
                            sendEmail({
                                to: user.email,
                                subject: email_info.subject,
                                text: email_info.text,
                                html: email_info.html,
                            })
                        )
                    );

                    const successfulEmails = emailResults.filter(
                        (result) => result.status === "fulfilled"
                    ).length;
                    const failedEmails = emailResults.filter(
                        (result) => result.status === "rejected"
                    ).length;

                    console.log(`Article notification emails: ${successfulEmails} sent, ${failedEmails} failed.`);
                }
            } catch (emailErr) {
                console.error("Background article notification error:", emailErr?.message || emailErr);
            }
        })();

    } catch (error) {
        console.error("Create article error:", error);
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE CREATING ARTICLE"
        });
    }
};

export const article_details = async (req, res) => {
    try {
        const { id } = req.query;

        // Check ID presence
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ARTICLE ID IS REQUIRED"
            });
        }

        // Validate ID
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "INVALID ARTICLE ID"
            });
        }

        const article_details = await articlesServices.getArticleById(id);

        if (!article_details) {
            return res.status(404).json({
                success: false,
                message: "ARTICLE NOT FOUND !"
            });
        }

        return res.status(200).json({
            success: true,
            message: "GOT THE ARTICLE DETAILS ✅",
            data: article_details
        });
    } catch (error) {
        console.error("Get Article Details Error:", error?.message || error);
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE GETTING ARTICLE DETAILS"
        });
    }
};

export const my_articles = async (req, res) => {
    try {
        const user_id = req.curr_user.id;

        // Validate User ID
        if (!mongoose.isValidObjectId(user_id)) {
            return res.status(400).json({
                success: false,
                message: "INVALID USER ID"
            });
        }

        const all_articles = await articlesServices.getMyArticles(user_id);

        if (!all_articles || all_articles.length === 0) {
            return res.status(200).json({
                success: true,
                message: "NO ARTICLES FOUND",
                length: 0,
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "GOT ALL YOUR ARTICLES ✅",
            length: all_articles.length,
            data: all_articles
        });

    } catch (error) {
        console.error("Get My Articles Error:", error?.message || error);
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE GETTING YOUR ARTICLES"
        });
    }
};

export const update_article = async (req, res) => {
    try {

        //Check authenticated user
        const user_id = req.curr_user?.id;
        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: "UNAUTHORIZED"
            });
        }

        // Get article ID
        const article_id = req.query.article_id || req.query.id;
        if (!article_id) {
            return res.status(400).json({
                success: false,
                message: "ARTICLE ID IS REQUIRED"
            });
        }

        //Validate article ID
        if (!mongoose.isValidObjectId(article_id)) {
            return res.status(400).json({
                success: false,
                message: "INVALID ARTICLE ID"
            });
        }


        // Get request body
        const {
            title,
            shortDescription,
            detailsDescription,
            tag
        } = req.body;


        // Find article owned by user
        const article = await articlesServices.getByFields({
            _id: article_id,
            createdBy: user_id
        });
        if (!article) {
            return res.status(404).json({
                success: false,
                message: "ARTICLE NOT FOUND OR YOU ARE NOT THE OWNER"
            });
        }


        // Prepare update object
        const updateData = {};
        if (title !== undefined) {
            if (typeof title !== "string" || title.trim().length < 5 || title.trim().length > 150) {
                return res.status(400).json({
                    success: false,
                    message: "TITLE MUST BE BETWEEN 5 AND 150 CHARACTERS"
                });
            }

            const cleanTitle = title.trim();
            // Only check duplicate if title actually changed
            if (cleanTitle !== article.title) {
                const existingArticle = await articlesServices.getByFields({
                    title: cleanTitle,
                    createdBy: user_id
                });

                if (existingArticle && existingArticle._id.toString() !== article._id.toString()
                ) {
                    return res.status(409).json({
                        success: false,
                        message:
                            "YOU HAVE ALREADY CREATED AN ARTICLE WITH THIS TITLE"
                    });
                }
            }
            updateData.title = cleanTitle;
        }

        //  Validate short description
        if (shortDescription !== undefined) {
            if (
                typeof shortDescription !== "string" ||
                shortDescription.trim().length < 10 ||
                shortDescription.trim().length > 500
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "SHORT DESCRIPTION MUST BE BETWEEN 10 AND 500 CHARACTERS"
                });
            }

            updateData.shortDescription = shortDescription.trim();
            updateData.detailsDescription = detailsDescription.trim();

            // Validate tag ONLY if provided

            const validTags = [
                "technology",
                "code",
                "health",
                "finance",
                "education",
                "lifestyle",
                "entertainment",
                "sports",
                "travel",
                "food",
                "business"
            ];
            if (tag !== undefined) {
                if (typeof tag !== "string") {
                    return res.status(400).json({
                        success: false,
                        message: "INVALID TAG"
                    });
                }

                const cleanTag = tag.trim().toLowerCase();
                if (!validTags.includes(cleanTag)) {
                    return res.status(400).json({
                        success: false,
                        message: "INVALID TAG"
                    });
                }
                updateData.tag = cleanTag;
            }


            //  Validate banner if provided
            if (req.file) {
                // File size
                if (req.file.size > 5 * 1024 * 1024) {
                    return res.status(400).json({
                        success: false,
                        message: "BANNER FILE MUST NOT EXCEED 5 MB"
                    });
                }

                // File format
                const allowedMimeTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                ];

                if (!allowedMimeTypes.includes(req.file.mimetype)) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "INVALID BANNER FORMAT. ONLY JPEG, PNG OR WEBP ARE ALLOWED"
                    });
                }
            }

            // Upload banner if provided
            if (req.file) {
                const uploadedFile = await uploadToCloudinary(
                    req.file.buffer,
                    "articles"
                );
                if (!uploadedFile) {
                    return res.status(500).json({
                        success: false,
                        message: "BANNER UPLOAD FAILED"
                    });
                }

                updateData.banner =
                    uploadedFile.secure_url || uploadedFile.url;

                if (!updateData.banner) {
                    return res.status(500).json({
                        success: false,
                        message: "BANNER URL NOT FOUND AFTER UPLOAD"
                    });
                }
            }

            //  Check if anything was provided
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "NOTHING TO UPDATE"
                });
            }

            //  Update article
            const updatedArticle = await articlesServices.updateArticle(
                {
                    _id: article._id,
                    createdBy: user_id
                },
                updateData
            );
            if (!updatedArticle) {
                return res.status(500).json({
                    success: false,
                    message: "ARTICLE UPDATE FAILED"
                });
            }

            return res.status(200).json({
                success: true,
                message: "ARTICLE UPDATED ✅",
                data: updatedArticle
            });

        }
    } catch (error) {

        console.error("Update Article Error:", error?.message || error);
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE UPDATING ARTICLE"
        });
    }
}


export const delete_article = async (req, res) => {
    try {
        const user_id = req.curr_user.id;
        const article_id = req.query.article_id || req.query.id;

        // Check ID presence
        if (!article_id) {
            return res.status(400).json({
                success: false,
                message: "ARTICLE ID IS REQUIRED"
            });
        }

        // Validate Article ID
        if (!mongoose.isValidObjectId(article_id)) {
            return res.status(400).json({
                success: false,
                message: "INVALID ARTICLE ID"
            });
        }

        // Check if Exists
        const article = await articlesServices.getByFields({
            _id: article_id,
            createdBy: user_id
        });
        if (!article) {
            return res.status(404).json({
                success: false,
                message: "ARTICLE NOT FOUND OR YOU ARE NOT THE OWNER"
            });
        }

        // Deleting article from DB
        await articlesServices.deleteArticle({
            _id: article_id,
            createdBy: user_id
        });

        // Deleting Comments for the article
        await commentServices.deleteByArticleId(article_id);

        return res.status(200).json({
            success: true,
            message: "ARTICLE DELETED ✅"
        });

    } catch (error) {
        console.error("Delete Article Error:", error?.message || error);
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE DELETING ARTICLE"
        });
    }
};

export const get_articles = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;   //change according to frountend

        const skip = (page - 1) * limit;

        const articles = await articlesServices.getArticles(skip, limit);
        if (!articles) {
            return res.status(400).json({
                success: false,
                message: " NO ARTICLES FOUND "
            });
        }

        return res.status(200).json({
            success: true,
            message: "ARTICLES FETCHED SUCCESSFULLY",
            pagination: {
                currentPage: page,
                limit
            },
            length: articles.length,
            data: articles,

        });
    } catch (error) {
        console.error("Get Articles Error:", error?.message || error);
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE GETTING ARTICLES"
        });
    }
};