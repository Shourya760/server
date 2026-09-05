import mongoose from "mongoose";
import articlesServices from "../Services/articles.services.js";
import { uploadToCloudinary } from "../utils/cloudinaryTask.js";
import commentServices from "../Services/comment.services.js";

export const create_article = async (req, res) => {
    try {
        const user_id = req.curr_user.id;
        const { title, shortDescription, detailsDescription } = req.body;
        const banner = req.file;

        // Check all fields
        if (!title || !shortDescription || !detailsDescription) {
            return res.status(400).json({
                success: false,
                message: "ALL FIELDS REQUIRED"
            });
        }

        // Validate User ID
        if (!mongoose.isValidObjectId(user_id)) {
            return res.status(400).json({
                success: false,
                message: "INVALID USER ID"
            });
        }

        // Check title length
        if (title.trim().length < 5 || title.trim().length > 150) {
            return res.status(400).json({
                success: false,
                message: "TITLE MUST BE BETWEEN 5 AND 150 CHARACTERS"
            });
        }

        // Check duplicate article
        const existingArticle = await articlesServices.getByFields({
            title: title.trim(),
            createdBy: user_id
        });
        if (existingArticle) {
            return res.status(409).json({
                success: false,
                message: "ALREADY CREATED AN ARTICLE WITH THIS TITLE"
            });
        }

        // Check short description length
        if (shortDescription.trim().length < 10 || shortDescription.trim().length > 500) {
            return res.status(400).json({
                success: false,
                message: "SHORT DESCRIPTION CANNOT EXCEED 500 CHARACTERS"
            });
        }


        // size and formet check
        if (banner) {
            if (banner.size > 5 * 1024 * 1024) {
                return res.status(400).json({ message: "Too large" });
            }
            if (!["image/jpeg", "image/png"].includes(banner.mimetype)) {
                return res.status(400).json({ message: "Invalid format" });
            }
        }

        // Handling Banner if provided
        let banner_url = null;
        if (banner) {
            const uploadedFile = await uploadToCloudinary(banner.buffer);
            banner_url = uploadedFile.secure_url || uploadedFile.url;
        }

        const data = {
            title: title.trim(),
            shortDescription: shortDescription.trim(),
            detailsDescription: detailsDescription.trim(),
            banner: banner_url,
            createdBy: user_id
        };

        // Adding to DB
        const response = await articlesServices.createArticle(data);

        return res.status(201).json({
            success: true,
            message: "ARTICLE CREATED ✅",
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE CREATING ARTICLE => " + error.message
        });
    }
};

export const article_details = async (req, res) => {
    try {
        const id = req.query.id || req.query.article_id;

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

        const article_details = await articlesServices.getByFields({ _id: id });
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
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE GETTING ARTICLE DETAILS => " + error.message
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
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE GETTING YOUR ARTICLES => " + error.message
        });
    }
};

export const update_article = async (req, res) => {
    try {
        const user_id = req.curr_user.id;
        const article_id = req.query.article_id || req.query.id;
        const { title, shortDescription, detailsDescription } = req.body;

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

        // Check if article exists and belongs to user
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

        const updateData = {};

        // Check title if provided
        if (title !== undefined) {
            if (typeof title !== "string" || title.trim().length < 5 || title.trim().length > 150) {
                return res.status(400).json({
                    success: false,
                    message: "TITLE MUST BE BETWEEN 5 AND 150 CHARACTERS"
                });
            }

            // Check duplicate article only if title is changed
            if (title.trim() !== article.title) {
                const existingArticle = await articlesServices.getByFields({
                    title: title.trim(),
                    createdBy: user_id
                });
                if (existingArticle && existingArticle._id.toString() !== article_id.toString()) {
                    return res.status(409).json({
                        success: false,
                        message: "YOU HAVE ALREADY CREATED AN ARTICLE WITH THIS TITLE"
                    });
                }
            }

            updateData.title = title.trim();
        }

        // Check short description if provided
        if (shortDescription !== undefined) {
            if (typeof shortDescription !== "string" || shortDescription.trim().length < 10 || shortDescription.trim().length > 500) {
                return res.status(400).json({
                    success: false,
                    message: "SHORT DESCRIPTION CANNOT EXCEED 500 CHARACTERS"
                });
            }
            updateData.shortDescription = shortDescription.trim();
        }

        // Check detailed description if provided
        if (detailsDescription !== undefined) {
            if (typeof detailsDescription !== "string" || detailsDescription.trim().length < 20 || detailsDescription.trim().length > 10000) {
                return res.status(400).json({
                    success: false,
                    message: "DETAILS DESCRIPTION MUST BE BETWEEN 20 AND 10000 CHARACTERS"
                });
            }
            updateData.detailsDescription = detailsDescription.trim();
        }


        // banner size and formet check
        if (req.file) {
            if (req.file.size > 5 * 1024 * 1024) {
                return res.status(400).json({ message: "Too large File" });
            }
            if (!["image/jpeg", "image/png"].includes(req.file.mimetype)) {
                return res.status(400).json({ message: "Invalid format" });
            }
        }

        // Handle banner upload if provided
        if (req.file) {
            const uploadedFile = await uploadToCloudinary(req.file.buffer);
            updateData.banner = uploadedFile.secure_url || uploadedFile.url;
        }

        // Updating Article
        const updatedArticle = await articlesServices.updateArticle(
            { _id: article_id, createdBy: user_id },
            updateData
        );

        return res.status(200).json({
            success: true,
            message: "ARTICLE UPDATED ✅",
            data: updatedArticle
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE UPDATING ARTICLE => " + error.message
        });
    }
};

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
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE DELETING ARTICLE => " + error.message
        });
    }
};

export const get_articles = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

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
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE GETTING ARTICLES => " + error.message
        });
    }
};