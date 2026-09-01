import Article from "../Schema/articleSchema.js";

class ArticleServices {

    async createArticle(data) {
        return await Article.create(data);
    }

    async getByFields(data) {
        return await Article.findOne(data)
            .populate('createdBy', 'name email profileImage')
            .select('-comments')
    }

    async getMyArticles(userId) {
        return await Article.find({ createdBy: userId })
            .select('-comments -createdBy');
    }

    async updateArticle(filter, data) {
        return await Article.findOneAndUpdate(
            filter,
            data,
        );
    }

    async addCommentToArticle(article_id, comment_id) {
        return await Article.findByIdAndUpdate(article_id,
            {
                $push: { comments: comment_id }
            },
            { new: true }
        );
    }
}

export default new ArticleServices;
