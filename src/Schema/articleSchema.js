import mongoose from "mongoose";


const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        shortDescription: {
            type: String,
            required: true,
            trim: true,
        },
        detailsDescription: {
            type: String,
            required: true,
            trim: true,
        },
        banner: {
            type: String,
            required: false,
            trim: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        comments: {

        }
    },
    { timestamps: true }
)

const Article = mongoose.model("Article", articleSchema);

export default Article;