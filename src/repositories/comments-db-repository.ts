import {Comment} from "../server/db/conn";
import {CommentType} from "../services/coments-service";

class CommentsRepo {
    async createComment(newComment: CommentType): Promise<boolean> {
        const comment = new Comment(newComment);
        const savedDoc = await comment.save();
        return savedDoc.id === newComment.id;
    }

    async updateCommentById(commentId: string, content: string): Promise<boolean> {
        const comment = await Comment.findOneAndUpdate({"id": commentId}, {
            $set: {
                content: content
            }
        }, {new: true});
        return true;
    }
}

export {
     CommentsRepo
}