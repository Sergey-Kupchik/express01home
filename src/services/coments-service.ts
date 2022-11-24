import {dbCollections} from "../server/db/conn";
import {commentsRepository} from "../repositories/comments-db-repository";
import {UserType} from "../repositories/users-db-repository";
import {currentDate} from "../utils/utils";
import {commentsQueryRepository} from "../repositories/queries/comments-query-repository";
import {v4 as uuidv4} from "uuid";

const commentsService = {
    async createComment(postId: string, content: string, user: UserType): Promise<CommentOutputType | null> {
        const newComment: CommentType = {
            id: uuidv4(),
            content,
            userId: user.id,
            userLogin: user.login,
            createdAt: currentDate(),
            postId,
        }
        const isCommentCreated: boolean = await commentsRepository.createComment(newComment)
        if (!isCommentCreated) {
            return null
        }
        const post: CommentType | null = await commentsQueryRepository.getCommentById(newComment.id)
        return post;
    },
    async updateCommentById(commentId: string, content: string): Promise<boolean> {
        const result = commentsRepository.updateCommentById(commentId, content)
        return result
    },
};

type CommentType = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
    postId: string
}
type CommentOutputType = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
}
export {commentsService, CommentType, CommentOutputType}


