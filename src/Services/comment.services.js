import Comment from "../Schema/commentSchema.js";

class CommentServices {

    async createComment(data) {
        return await Comment.create(data);
    }

    async deleteByArticleId(article_id) {
        return await Comment.deleteMany({
            articleId: article_id
        });
    }

    async getCommentsByArticleId(article_id) {
        return await Comment.find({
            articleId: article_id
        }).populate("createdBy", "name email profileImage");
    }

}
export default new CommentServices;