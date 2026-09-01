import mongoose from "mongoose";
import articlesServices from "../Services/articles.services.js";
import commentServices from "../Services/comment.services.js";
import userServices from "../Services/user.services.js";
import sendEmail from "../utils/sendemail.js";
import { commentEmail } from "../emailformats/commentEmail.js";

export const create_comment = async (req, res) => {
    try {
        const user_id = req.curr_user.id;
        const article_id = req.query.article_id || req.query.id;
        const { comment } = req.body;

        // Required fields
        if (!article_id || !comment?.trim()) {
            return res.status(400).json({
                success: false,
                message: "ARTICLE ID AND COMMENT ARE REQUIRED"
            });
        }

        // Validate IDs
        if (!mongoose.isValidObjectId(user_id)) {
            return res.status(400).json({
                success: false,
                message: "INVALID USER ID"
            });
        }

        if (!mongoose.isValidObjectId(article_id)) {
            return res.status(400).json({
                success: false,
                message: "INVALID ARTICLE ID"
            });
        }

        // Comment length
        if (comment.trim().length > 1000) {
            return res.status(400).json({
                success: false,
                message: "COMMENT CANNOT EXCEED 1000 CHARACTERS"
            });
        }

        // Get commenter
        const commenter = await userServices.getUserByField("_id", user_id);
        if (!commenter) {
            return res.status(401).json({
                success: false,
                message: "USER NOT FOUND"
            });
        }

        // Check article
        const article = await articlesServices.getByFields({
            _id: article_id
        });
        if (!article) {
            return res.status(404).json({
                success: false,
                message: "ARTICLE NOT FOUND"
            });
        }

        // Create comment
        const new_comment = await commentServices.createComment({
            createdBy: user_id,
            articleId: article_id,
            comment: comment.trim()
        });

        // Add comment to article
        const added_comment = await articlesServices.addCommentToArticle(
            article_id,
            new_comment._id
        );
        if (!added_comment) {
            return res.status(500).json({
                success: false,
                message: "FAILED TO ADD COMMENT TO ARTICLE"
            });
        }

        // Send email
        if (article.createdBy._id.toString() !== user_id.toString()) {
            const email_info = commentEmail(
                article,
                commenter,
                comment.trim()
            );
            sendEmail({
                to: article.createdBy.email,
                subject: email_info.subject,
                text: email_info.text,
                html: email_info.html,
            }).catch((error) => {
                console.error("Error in Email =>", error.message || error);
            });
        }

        return res.status(201).json({
            success: true,
            message: "COMMENT POSTED SUCCESSFULLY",
            data: new_comment
        });

    } catch (error) {
        console.error("Create Comment Error:", error);

        return res.status(500).json({
            success: false,
            message: "ERROR WHILE CREATING COMMENT => " + error.message
        });
    }
};

export const get_comments = async (req, res) => {
    try {
        const article_id = req.query.article_id || req.query.id;
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

        const comments = await commentServices.getCommentsByArticleId(article_id);

        return res.status(200).json({
            success: true,
            message: "COMMENTS FETCHED SUCCESSFULLY",
            data: comments
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE GETTING COMMENTS => " + error.message
        });
    }
};

export const update_comment = async (req, res) => {
    try {
        const user_id = req.curr_user.id;
        const comment_id = req.query.comment_id || req.query.id;
        const { comment } = req.body;

        // Check if all fields provided
        if (!comment_id || !comment?.trim()) {
            return res.status(400).json({
                success: false,
                message: "COMMENT ID AND COMMENT ARE REQUIRED"
            });
        }

        // Validate IDs
        if (!mongoose.isValidObjectId(user_id)) {
            return res.status(400).json({
                success: false,
                message: "INVALID USER ID"
            });
        }

        if (!mongoose.isValidObjectId(comment_id)) {
            return res.status(400).json({
                success: false,
                message: "INVALID COMMENT ID"
            });
        }

        // Comment length
        if (comment.trim().length > 1000) {
            return res.status(400).json({
                success: false,
                message: "COMMENT CANNOT EXCEED 1000 CHARACTERS"
            });
        }

        // Updating Comment
        const updated_comment = await commentServices.updateComment(
            {
                _id: comment_id,
                createdBy: user_id
            },
            {
                comment: comment.trim()
            }
        );
        if (!updated_comment) {
            return res.status(404).json({
                success: false,
                message: "COMMENT NOT FOUND OR YOU ARE NOT THE OWNER"
            });
        }

        return res.status(200).json({
            success: true,
            message: "COMMENT UPDATED SUCCESSFULLY ✅",
            data: updated_comment
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE UPDATING COMMENT => " + error.message
        });
    }
};

export const delete_comment = async (req, res) => {
    try {
        const user_id = req.curr_user.id;
        const comment_id = req.query.comment_id || req.query.id;

        // Checking for field
        if (!comment_id) {
            return res.status(400).json({
                success: false,
                message: "COMMENT ID IS REQUIRED"
            });
        }

        // Validate IDs
        if (!mongoose.isValidObjectId(user_id)) {
            return res.status(400).json({
                success: false,
                message: "INVALID USER ID"
            });
        }

        if (!mongoose.isValidObjectId(comment_id)) {
            return res.status(400).json({
                success: false,
                message: "INVALID COMMENT ID"
            });
        }

        // Deleting Comment
        const deleted_comment = await commentServices.deleteComment({
            _id: comment_id,
            createdBy: user_id
        });
        if (!deleted_comment) {
            return res.status(404).json({
                success: false,
                message: "COMMENT NOT FOUND OR YOU ARE NOT THE OWNER"
            });
        }

        // Remove comment ID from Article
        await articlesServices.removeCommentFromArticle(
            deleted_comment.articleId,
            deleted_comment._id
        );

        return res.status(200).json({
            success: true,
            message: "COMMENT DELETED SUCCESSFULLY ✅"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ERROR WHILE DELETING COMMENT => " + error.message
        });
    }
};

