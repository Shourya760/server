import Article from "../Schema/articleSchema.js";

class ArticleServices {

    async createArticle(data) {
        return await Article.create(data);
    }

    async getArticles(skip, limit) {
        return await Article.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    }

    async getByFields(data) {
        return await Article.findOne(data)
            .populate('createdBy', 'name email profile')
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
            { new: true }
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

    async removeCommentFromArticle(article_id, comment_id) {
        return await Article.findByIdAndUpdate(
            article_id,
            {
                $pull: {
                    comments: comment_id
                }
            },
            {
                new: true
            }
        );
    }
}

export default new ArticleServices;
