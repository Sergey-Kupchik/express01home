import {dbCollections} from "../server/db/conn";
import {CommentType} from "../services/coments-service";
import {PostInfoType} from "../services/posts-service";


const commentsRepository = {
    async createComment(newComment: CommentType): Promise<boolean> {
        const result = await dbCollections.comments.insertOne(newComment)
        return result.acknowledged;
    },
    async updateCommentById(commentId: string, content: string): Promise<boolean> {
        const result = await dbCollections.comments.updateOne({id:commentId}, {
            $set: {content:content}
        })
        return result.matchedCount === 1
    },
};



export {
    commentsRepository
}