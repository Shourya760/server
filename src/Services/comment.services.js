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
        }).populate("createdBy", "name email profile");
    }

    async updateComment(filter, data) {
        return await Comment.findOneAndUpdate(
            filter,
            data,
            { new: true }
        );
    }

    async deleteComment(filter) {
        return await Comment.findOneAndDelete(filter);
    }

}
export default new CommentServices;