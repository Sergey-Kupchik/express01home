import {Request, Response, Router} from 'express';
import {isAuthZ} from "../middlewares/isAuthZ-middleware";
import {blogsRepository, BlogType} from "../repositories/blogs-repository";
import {
    inputBlogsValidationMiddleware,
    nameValidation,
    youtubeUrlValidation
} from "../middlewares/blogs-validation-middleware";

const blogsRouter = Router();

blogsRouter.get('/', (req: Request, res: Response) => {
    const blogs: BlogType[] = blogsRepository.getAllBlogs()
    res.send(blogs)
});

blogsRouter.get('/:id', (req: Request, res: Response) => {
    const blog: BlogType | undefined = blogsRepository.getBlogById(req.params.id)
    if (!blog) {
        res.send(404)
    }
    res.send(blog)
});

blogsRouter.post('/',
    isAuthZ,
    nameValidation,
    youtubeUrlValidation,
    inputBlogsValidationMiddleware,
    (req: Request, res: Response) => {
        const newBlog: BlogType = blogsRepository.createProduct(req.body.name, req.body.youtubeUrl)
        res.status(201).send(newBlog)
    });

blogsRouter.put('/:id',
    isAuthZ,
    nameValidation,
    youtubeUrlValidation,
    inputBlogsValidationMiddleware,
    (req: Request, res: Response) => {
        const isUpdated: boolean = blogsRepository.updateBlog(req.params.id, req.body.name, req.body.youtubeUrl)
        if (!isUpdated) {
            res.send(404)
        }
        res.send(204)
    });

blogsRouter.delete('/:id',
    isAuthZ,
    (req: Request, res: Response) => {
        const isDeleted: boolean = blogsRepository.deleteBlogById(req.params.id, )
        if (!isDeleted) {
            res.send(404)
        }
        res.send(204)
    });

export {
    blogsRouter
}