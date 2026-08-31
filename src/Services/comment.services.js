import Comment from "../Schema/commentSchema";

class CommentServices {
    async deleteByArticleId(article_id) {
        return await Comment.deleteMany({
            articleId: article_id
        });

    }

}

export default new CommentServices;