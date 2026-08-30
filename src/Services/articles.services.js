import Article from "../Schema/articleSchema.js";

class ArticleServices {

    async createArticle(data) {
        return await Article.create(data);
    }

    async getByFields(data) {
        return await Article.findOne(data);
    }
}

export default new ArticleServices;
