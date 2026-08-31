import mongoose from "mongoose";


const commentSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: true,
            trim: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        articleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Article",
        }
    },
    { timestamps: true }
)

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;