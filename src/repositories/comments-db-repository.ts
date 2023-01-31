import {Blog, Comment, dbCollections} from "../server/db/conn";
import {CommentType} from "../services/coments-service";
import {PostInfoType} from "../services/posts-service";


const commentsRepository = {
    async createComment(newComment: CommentType): Promise<boolean> {
        // const result = await dbCollections.comments.insertOne(newComment)
        // return result.acknowledged;
        const comment = new Comment(newComment);
        const savedDoc = await comment.save();
        return savedDoc.id === newComment.id;
    },
    async updateCommentById(commentId: string, content: string): Promise<boolean> {
        // const result = await dbCollections.comments.updateOne({id:commentId}, {
        //     $set: {content:content}
        // })
        const comment = await Comment.findOneAndUpdate({"id": commentId}, {
            $set: {
                content:content
            }
        }, {new: true});
        return true;

        // return result.matchedCount === 1
    },
};



export {
    commentsRepository
}