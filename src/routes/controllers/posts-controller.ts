import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {CommentsQueryRepo} from "../../repositories/queries/comments-query-repository";
import {LikeQueryRepo} from "../../repositories/queries/likes-query-repository";
import {IExtendedPost, PostsOutputType, PostsQueryRepo} from "../../repositories/queries/posts-query-repository";
import {CommentOutputType, CommentsService} from "../../services/coments-service";
import {PostsService, PostType} from "../../services/posts-service";
import {LikesService} from "../../services/likes-service";

@injectable()
export class PostsController {

    constructor(@inject(PostsQueryRepo) protected postsQueryRepository: PostsQueryRepo,
                @inject(PostsService) protected postsService: PostsService,
                @inject(CommentsService) protected commentsService: CommentsService,
                @inject(CommentsQueryRepo) protected commentsQueryRepository: CommentsQueryRepo,
                @inject(LikeQueryRepo) protected likesQueryRepository: LikeQueryRepo,
                @inject(LikesService) protected likesService: LikesService,
    ) {

    }

    async getFilteredPosts(req: Request, res: Response) {
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : "createdAt";
        const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : "desc";
        const posts: PostsOutputType = await this.postsQueryRepository.getFilteredPosts(pageNumber, pageSize, sortBy, sortDirection, req.user?.accountData.id)
        res.send(posts)
        return
    }

    async getPostById(req: Request, res: Response) {
        const posts: IExtendedPost | null = await this.postsQueryRepository.getExtendedPostInfoById({postId: req.params.id, userId: req.user?.accountData.id})
        if (!posts) {
            res.sendStatus(404)
            return
        }
        res.send(posts)
        return
    }

    async updatePost(req: Request, res: Response) {
        const isUpdated: boolean = await this.postsService.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        if (!isUpdated) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
        return
    }

    async deletePostById(req: Request, res: Response) {
        const isDeleted: boolean = await this.postsService.deletePostById(req.params.id,)
        if (!isDeleted) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
        return
    }

    async createPost(req: Request, res: Response) {
        const newPostId: string | null = await this.postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
        if (newPostId) {
            const newBlog = await this.postsQueryRepository.getPostById(newPostId)
            res.status(201).send(newBlog)
            return
        } else {
            res.sendStatus(204)
            return
        }
    }

    async createComment(req: Request, res: Response) {
        const comment = await this.commentsService.createComment(req.params.id, req.body.content, req.user!.accountData,)
        if (!comment) {
            return res.sendStatus(404)
        }
        return res.status(201).send(comment)

    }

    async getComments4Post(req: Request, res: Response) {
        const posts: PostType | null = await this.postsQueryRepository.getPostById(req.params.id.toString())
        if (!posts) {
            res.sendStatus(404)
            return
        }
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : "createdAt";
        const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : "desc";
        const commentsWithNoLikesInfo = await this.commentsQueryRepository.getComments4Post(pageNumber, pageSize, sortBy, sortDirection, req.params.id)
        const itemsWithLikeInfo: CommentOutputType[] =
            await Promise.all(commentsWithNoLikesInfo.items.map(async (comment): Promise<CommentOutputType> => {
                const likesCountInfo = await this.likesQueryRepository.getLikesCount4Comment(comment.id)
                const myStatus = await this.likesQueryRepository.getCommentLikeStatus4User(req.user!.accountData.id, comment.id)
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
            }));
        const comments = {
            pagesCount: commentsWithNoLikesInfo.pagesCount,
            page: commentsWithNoLikesInfo.page,
            pageSize: commentsWithNoLikesInfo.pageSize,
            totalCount: commentsWithNoLikesInfo.totalCount,
            items: itemsWithLikeInfo
        }
        res.send(comments)
        return
    }

    async likeDislikePost(req: Request, res: Response) {
        const item = await this.postsQueryRepository.getPostById(req.params.id)
        if (!item) {
            res.sendStatus(404)
            return
        }
        const isUpdated: boolean = await this.likesService.likeDislikePost(req.user!.accountData.id, req.params.id, req.body.likeStatus,)
        if (isUpdated) {
            res.sendStatus(204)
            return
        } else {
            res.sendStatus(404)
            return
        }
    }
}
