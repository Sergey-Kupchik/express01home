import { Request, Response, Router } from 'express';
import { isAuthT } from "../middlewares/isAuth-middleware";
import { postsRepository, PostType } from "../repositories/posts-db-repository";
import { inputValidationMiddleware } from "../middlewares/validation-middleware";
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
         return
    });
postsRouter.get('/:id',
    async (req: Request, res: Response) => {
        const posts: PostType | null = await postsRepository.getPostById(req.params.id.toString())
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
        const isUpdated: boolean = await postsRepository.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        if (!isUpdated) {
             res.sendStatus(404)
             return
        }
         res.sendStatus(204)
         return
    });

postsRouter.delete('/:id',
    isAuthT,
    async (req: Request, res: Response) => {
        const isDeleted: boolean = await postsRepository.deletePostById(req.params.id,)
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
        const post: PostType | null= await postsRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
         if (post){
            res.status(201).send(post)
         return
        } else {
            res.sendStatus(204)
            return
        }
    })

export { postsRouter };