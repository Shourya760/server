

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        shortDescription: {
            type: String,
            
        },
        detailsDescription: {

        },
        banner: {

        },
        createdBy: {

        },
        comments: {

        },
        createdAt: {

        },
        updatedAt: {

        },
    },
    { timestamps: true }
)