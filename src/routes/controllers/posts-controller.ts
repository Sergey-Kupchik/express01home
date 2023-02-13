import {PostsOutputType, PostsQueryRepo} from "../../repositories/queries/posts-query-repository";
import {PostsService, PostType} from "../../services/posts-service";
import {CommentOutputType, CommentsService} from "../../services/coments-service";
import {CommentGroupType, CommentsQueryRepo} from "../../repositories/queries/comments-query-repository";
import {Request, Response} from "express";

export class PostsController {

    constructor(protected postsQueryRepository: PostsQueryRepo,
                protected postsService: PostsService,
                protected commentsService: CommentsService,
                protected commentsQueryRepository: CommentsQueryRepo,) {

    }

    async getFilteredPosts(req: Request, res: Response) {
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : "createdAt";
        const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : "desc";
        const posts: PostsOutputType = await this.postsQueryRepository.getFilteredPosts(pageNumber, pageSize, sortBy, sortDirection)
        res.send(posts)
        return
    }

    async getPostById(req: Request, res: Response) {
        const posts: PostType | null = await this.postsQueryRepository.getPostById(req.params.id.toString())
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
        const comment: CommentOutputType | null = await this.commentsService.createComment(req.params.id, req.body.content, req.user!.accountData,)
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
        const comments: CommentGroupType = await this.commentsQueryRepository.getComments4Post(pageNumber, pageSize, sortBy, sortDirection, req.params.id)
        res.send(comments)
        return
    }
}