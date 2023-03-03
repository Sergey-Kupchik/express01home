import { inject, injectable } from "inversify";
import { v4 as uuidv4 } from "uuid";
import { CommentsRepo } from "../repositories/comments-db-repository";
import { CommentsQueryRepo } from "../repositories/queries/comments-query-repository";
import { LikeQueryRepo } from "../repositories/queries/likes-query-repository";
import { PostsQueryRepo } from "../repositories/queries/posts-query-repository";
import { UserType } from "../repositories/users-db-repository";
import { currentDate } from "../utils/utils";
import { PostType } from "./posts-service";

@injectable()
class CommentsService {

    constructor(@inject(PostsQueryRepo) protected postsQueryRepository: PostsQueryRepo,
        @inject(CommentsQueryRepo) protected commentsQueryRepository: CommentsQueryRepo,
        @inject(CommentsRepo) protected commentsRepository: CommentsRepo,
        @inject(LikeQueryRepo) protected likesQueryRepository: LikeQueryRepo
    ) {
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
                const likesCountInfo = await this.likesQueryRepository.getLikesCount4Comment(comment.id)
                const myStatus = await this.likesQueryRepository.getCommentLikeStatus4User(user.id, comment.id)
                return {
                    id: comment.id,
                    content: comment.content,
                    commentatorInfo: {
                        userId: comment.userId,
                        userLogin: comment.userLogin,
                    },
                    createdAt: comment.createdAt,
                    likesInfo: {
                        likesCount: likesCountInfo.likesCount,
                        dislikesCount: likesCountInfo.dislikesCount,
                        myStatus: myStatus
                    },
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

// type CommentOutputType = {
//     id: string
//     content: string
//     userId: string
//     userLogin: string
//     createdAt: string
//     likesInfo: {
//         likesCount: number,
//         dislikesCount: number,
//         myStatus: LikeQueryRepoEnum
//     }
// }

type CommentOutputType = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: LikeQueryRepoEnum
    }
}


enum LikeQueryRepoEnum {
    None = "None",
    Like = "Like",
    Dislike = "Dislike"
}

export { CommentType, CommentOutputType, CommentsService };


