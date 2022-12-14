import {Request, Response, Router} from 'express';
import {authJwt, isAuthT} from "../middlewares/isAuth-middleware";
import {inputValidationMiddleware} from "../middlewares/validation-middleware";
import {
    blogIdValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation, contentCommentsValidation
} from "../middlewares/posts-validation-middleware";
import {postsService, PostType} from "../services/posts-service";
import {PostsOutputType, postsQueryRepository} from "../repositories/queries/posts-query-repository";
import {CommentOutputType, commentsService} from "../services/coments-service";
import {CommentGroupType, commentsQueryRepository} from "../repositories/queries/comments-query-repository";


const postsRouter = Router();

postsRouter.get('/',
    async (req: Request, res: Response) => {
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : "createdAt";
        const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : "desc";
        const posts: PostsOutputType = await postsQueryRepository.getFilteredPosts( pageNumber, pageSize, sortBy, sortDirection)
        res.send(posts)
        return
    });
postsRouter.get('/:id',
    async (req: Request, res: Response) => {
        const posts: PostType | null = await postsQueryRepository.getPostById(req.params.id.toString())
        if (!posts) {
            res.sendStatus(404)
            return
        }
        res.send(posts)
        return
    });
postsRouter.put('/:id',

    // param('id').isLength({max: 2}).withMessage('max length is 3'),
    isAuthT,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const isUpdated: boolean = await postsService.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        if (!isUpdated) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
        return
    });

postsRouter.delete('/:id',
    isAuthT,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted: boolean = await postsService.deletePostById(req.params.id,)
        if (!isDeleted) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
        return
    });

postsRouter.post('/',
    isAuthT,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const newPostId: string | null = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
        if (newPostId) {
            const newBlog = await postsQueryRepository.getPostById(newPostId)
            res.status(201).send(newBlog)
            return
        } else {
            res.sendStatus(204)
            return
        }
    })

postsRouter.post('/:id/comments',
    authJwt,
    contentCommentsValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const comment: CommentOutputType|null = await commentsService.createComment(req.params.id, req.body.content, req.user!.accountData,)
        if (!comment) {
            return res.sendStatus(404)
        }
        return res.status(201).send(comment)

    });

postsRouter.get('/:id/comments',
    async (req: Request, res: Response) => {
        const posts: PostType | null = await postsQueryRepository.getPostById(req.params.id.toString())
        if (!posts) {
            res.sendStatus(404)
            return
        }
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : "createdAt";
        const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : "desc";
        const comments: CommentGroupType = await commentsQueryRepository.getComments4Post( pageNumber, pageSize, sortBy, sortDirection, req.params.id)
        res.send(comments)
        return
    });

export {postsRouter};