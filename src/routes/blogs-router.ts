import {Request, Response, Router} from 'express';
import {isAuthT} from "../middlewares/isAuth-middleware";
import {blogsRepository, BlogType} from "../repositories/blogs-repository";
import {
    nameValidation,
    youtubeUrlValidation
} from "../middlewares/blogs-validation-middleware";
import {inputValidationMiddleware} from "../middlewares/validation-middleware";

const blogsRouter = Router();

blogsRouter.get('/', async (req: Request, res: Response) => {
    const blogs: BlogType[] = await blogsRepository.getAllBlogs()
    res.send(blogs)
});

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blog: BlogType | undefined = await blogsRepository.getBlogById(req.params.id)
    if (!blog) {
        res.send(404)
    }
    res.send(blog)
});

blogsRouter.post('/',
    isAuthT,
    nameValidation,
    youtubeUrlValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const newBlog: BlogType = await blogsRepository.createProduct(req.body.name, req.body.youtubeUrl)
        res.status(201).send(newBlog)
    });

blogsRouter.put('/:id',
    isAuthT,
    nameValidation,
    youtubeUrlValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const isUpdated: boolean =  await blogsRepository.updateBlog(req.params.id, req.body.name, req.body.youtubeUrl)
        if (!isUpdated) {
            res.send(404)
        }
        res.send(204)
    });

blogsRouter.delete('/:id',
    isAuthT,
    async (req: Request, res: Response) => {
        const isDeleted: boolean =  await blogsRepository.deleteBlogById(req.params.id, )
        if (!isDeleted) {
            res.send(404)
        }
        res.send(204)
    });

export {
    blogsRouter
}