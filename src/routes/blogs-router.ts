import {Request, Response, Router} from 'express';
import {isAuthT} from "../middlewares/isAuth-middleware";
import {
    nameValidation,
    youtubeUrlValidation
} from "../middlewares/blogs-validation-middleware";
import {inputValidationMiddleware} from "../middlewares/validation-middleware";
import {blogsService, BlogType} from "../services/blogs-service";
import {blogsQueryRepository} from "../repositories/queries/blogs-query-repository";

const blogsRouter = Router();

blogsRouter.get('/', async (req: Request, res: Response) => {
    const blogs: BlogType[] = await blogsQueryRepository.getAllBlogs()
     res.send(blogs)
     return
});

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blog: BlogType | null = await blogsQueryRepository.getBlogById(req.params.id)
    if (!blog) {
         res.sendStatus(404)
         return
        
    }
     res.send(blog)
     return

});

blogsRouter.post('/',
    isAuthT,
    nameValidation,
    youtubeUrlValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const newBlogId: string|null = await blogsService.createBlog(req.body.name, req.body.youtubeUrl)
        if (newBlogId){
           const newBlog =  blogsQueryRepository.getBlogById(newBlogId)
            res.status(201).send(newBlog)
            return
        }
        res.sendStatus(404)
        return
    });

blogsRouter.put('/:id',
    isAuthT,
    nameValidation,
    youtubeUrlValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const isUpdated: boolean =  await blogsService.updateBlog(req.params.id, req.body.name, req.body.youtubeUrl)
        if (!isUpdated) {
             res.sendStatus(404)
             return
        }
         res.sendStatus(204)
         return
    });

blogsRouter.delete('/:id',
    isAuthT,
    async (req: Request, res: Response) => {
        const isDeleted: boolean =  await blogsService.deleteBlogById(req.params.id, )
        if (!isDeleted) {
             res.sendStatus(404)
             return
        }
         res.sendStatus(204)
         return
    });

export {
    blogsRouter
}