import {Request, Response, Router} from 'express';
import {isAuthZ} from "../middlewares/isAuthZ-middleware";
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
    (req: Request, res: Response) => {
        const posts: PostType[] = postsRepository.getAllPosts()
        res.send(posts)
    });
postsRouter.get('/:id',
    (req: Request, res: Response) => {
        const posts: PostType | undefined = postsRepository.getPostById(req.params.id.toString())
        if (!posts) {
            res.send(404)
        }
        res.send(posts)
    });
postsRouter.put('/:id',
    isAuthZ,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {
        const isUpdated: boolean = postsRepository.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        if (!isUpdated) {
            res.send(404)
        }
        res.send(204)
    });

postsRouter.delete('/:id',
    isAuthZ,
    (req: Request, res: Response) => {
        const isDeleted: boolean = postsRepository.deletePostById(req.params.id,)
        if (!isDeleted) {
            res.send(404)
        }
        res.send(204)
    });

postsRouter.post('/',
    isAuthZ,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {
        const post = postsRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
        res.status(201).send(post)
    })

export {postsRouter};