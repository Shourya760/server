import Article from "../Schema/articleSchema.js";

class ArticleServices {

    async createArticle(data) {
        return await Article.create(data);
    }

    async getByFields(data) {
        return await Article.findOne(data)
            .populate('createdBy')
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
}

export default new ArticleServices;
