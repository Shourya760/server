import mongoose from "mongoose";
import articlesServices from "../Services/articles.services.js";
import { uploadToCloudinary } from "../utils/cloudinaryTask.js";
import commentServices from "../Services/comment.services.js";

export const create_article = async (req, res) => {
    try {
        const user_id = req.curr_user.id;
        const { title, shortDescription, detailsDescription } = req.body;
        const banner = req.file;

        // Check all fiels
        if (!title || !shortDescription || !detailsDescription) {
            return res.status(400).json({
                success: false,
                message: "ALL FIELDS REQUIRED "
            });
        };

        //  Check title length
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
                message: "YOU HAVE ALREADY CREATED AN ARTICLE WITH THIS TITLE"
            });
        }

        //  Check short description length
        if (shortDescription.trim().length < 10 || shortDescription.trim().length > 500) {
            return res.status(400).json({
                success: false,
                message: "SHORT DESCRIPTION CANNOT EXCEED 500 CHARACTERS"
            });
        }

        //  Check detailed description length
        if (detailsDescription.trim().length < 20 || detailsDescription.trim().length > 10000) {
            return res.status(400).json({
                success: false,
                message: "DETAILS DESCRIPTION MUST BE BETWEEN 20 AND 10000 CHARACTERS"
            });
        }

        // Handling Banner is provided
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
        }

        // Adding to DB
        const response = await articlesServices.createArticle(data);


        return res.status(200).json({
            success: true,
            message: "ARTICLE CREATED ✅",
            data: response
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE CREATING ARTICLE =>" + error
        });
    }
}

export const article_details = async (req, res) => {
    try {
        const { id } = req.query;
        const article_details = await articlesServices.getByFields({ _id: id });
        if (!article_details) {
            return res.status(400).json({
                success: false,
                message: "ARTICLE NOT FOUND !"
            });
        }

        return res.status(200).json({
            success: true,
            message: "GOT THE ARTICLE DETAILS ✅",
            data: article_details
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE GETTING  ARTICLE DETAILS =>" + error
        });
    }
}

export const my_articles = async (req, res) => {
    try {
        const user_id = req.curr_user.id;



        // check for valid id
        if (!mongoose.isValidObjectId(user_id)) {
            return res.status(400).json({
                success: false,
                message: "INVALID ARTICLE ID"
            });
        }

        const all_articles = await articlesServices.getMyArticles(user_id);

        if (all_articles.length === 0) {
            return res.status(400).json({
                success: false,
                message: "NO ARTICLES FOUND!"
            });
        }

        return res.status(200).json({
            success: true,
            message: all_articles.length
                ? "GOT ALL YOUR ARTICLES ✅"
                : "NO ARTICLES FOUND",
            length: all_articles.length,
            data: all_articles
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE GETTING  YoUR ARTICLE  =>" + error
        });
    }
}

export const update_article = async (req, res) => {
    try {
        const user_id = req.curr_user.id;
        const { id } = req.query;
        const { title, shortDescription, detailsDescription } = req.body;


        // Check if article exists
        const article = await articlesServices.getByFields({
            _id: id,
            createdBy: user_id
        });
        if (!article) {
            return res.status(404).json({
                success: false,
                message: "ARTICLE NOT FOUND"
            });
        }

        // Updating Article
        const updatedArticle = await articlesServices.updateArticle(
            { _id: id, createdBy: user_id },
            {
                title: title?.trim(),
                shortDescription: shortDescription?.trim(),
                detailsDescription: detailsDescription?.trim()
            }
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
        const { id } = req.query;

        // Check if Exists
        const article = await articlesServices.getByFields({
            _id: id,
            createdBy: user_id
        });
        if (!article) {
            return res.status(404).json({
                success: false,
                message: "ARTICLE NOT FOUND"
            });
        }

        // Deleting article from DB
        await articlesServices.deleteArticle({
            _id: id,
            createdBy: user_id
        });

        // Deleting Comments for the article
        await commentServices.deleteByArticleId(id);

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