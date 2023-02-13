import {CommentsRepo} from "../repositories/comments-db-repository";
import {UserType} from "../repositories/users-db-repository";
import {currentDate} from "../utils/utils";
import {CommentsQueryRepo} from "../repositories/queries/comments-query-repository";
import {v4 as uuidv4} from "uuid";
import {PostsQueryRepo} from "../repositories/queries/posts-query-repository";
import {PostType} from "./posts-service";

class CommentsService {

    constructor(protected postsQueryRepository: PostsQueryRepo,
                protected commentsQueryRepository: CommentsQueryRepo,
                protected commentsRepository: CommentsRepo,) {
    }

    async createComment(postId: string, content: string, user: UserType): Promise<CommentOutputType | null> {
        const post: PostType | null = await this.postsQueryRepository.getPostById(postId)
        if (post) {
            const newComment: CommentType = {
                id: uuidv4(),
                content,
                userId: user.id,
                userLogin: user.login,
                createdAt: currentDate(),
                postId,
            }
            const isCommentCreated: boolean = await this.commentsRepository.createComment(newComment)
            const comment: CommentType | null = await this.commentsQueryRepository.getCommentById(newComment.id)
            if (isCommentCreated && comment) {
                return {
                    id: comment.id,
                    content: comment.content,
                    userId: comment.userId,
                    userLogin: comment.userLogin,
                    createdAt: comment.createdAt,
                };
            } else {
                return null
            }
        }
        return null

    }

    async updateCommentById(commentId: string, content: string): Promise<boolean> {
        const result = this.commentsRepository.updateCommentById(commentId, content)
        return result
    }
}


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
export {CommentType, CommentOutputType, CommentsService}


