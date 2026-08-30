import articlesServices from "../Services/articles.services.js";
import { uploadToCloudinary } from "../utils/cloudinaryTask.js";

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
        if (shortDescription.trim().length > 500) {
            return res.status(400).json({
                success: false,
                message: "SHORT DESCRIPTION CANNOT EXCEED 500 CHARACTERS"
            });
        }

        // Handling Banner is provided
        let banner_url = " ";
        if (banner) {
            const uploadedFile = await uploadToCloudinary(banner.buffer);
            banner_url = uploadedFile.secure_url || uploadedFile.url;
        }

        const data = {
            title: title.trim(),
            shortDescription: shortDescription.trim(),
            detailsDescription,
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