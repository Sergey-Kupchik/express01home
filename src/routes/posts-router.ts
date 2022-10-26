import {Request, Response, Router} from 'express';
import {isAuthT} from "../middlewares/isAuth-middleware";
import {postsRepository, PostType} from "../repositories/posts-repository";
import {inputValidationMiddleware} from "../middlewares/validation-middleware";
import {
    blogIdValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation
} from "../middlewares/posts-validation-middleware";


const postsRouter = Router();

postsRouter.get('/',
    async (req: Request, res: Response) => {
        const posts: PostType[] = await postsRepository.getAllPosts()
        res.send(posts)
    });
postsRouter.get('/:id',
    async (req: Request, res: Response) => {
        const posts: PostType | undefined = await postsRepository.getPostById(req.params.id.toString())
        if (!posts) {
            res.send(404)
        }
        res.send(posts)
    });
postsRouter.put('/:id',
    isAuthT,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const isUpdated: boolean = await postsRepository.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        if (!isUpdated) {
            res.send(404)
        }
        res.send(204)
    });

postsRouter.delete('/:id',
    isAuthT,
    async (req: Request, res: Response) => {
        const isDeleted: boolean = await postsRepository.deletePostById(req.params.id,)
        if (!isDeleted) {
            res.send(404)
        }
        res.send(204)
    });

postsRouter.post('/',
    isAuthT,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const post: PostType = await postsRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
        res.status(201).send(post)
    })

export {postsRouter};