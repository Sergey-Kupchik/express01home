import {Request, Response, Router} from 'express';
import {isAuthT} from "../middlewares/isAuth-middleware";
import {
    nameValidation,
    youtubeUrlValidation
} from "../middlewares/blogs-validation-middleware";
import {inputValidationMiddleware} from "../middlewares/validation-middleware";
import {blogsService, BlogType} from "../services/blogs-service";
import {BlogOutputType, blogsQueryRepository, sortDirectionEnum} from "../repositories/queries/blogs-query-repository";
import {
    contentValidation,
    shortDescriptionValidation,
    titleValidation,
    urlBlogIdValidation
} from "../middlewares/posts-validation-middleware";
import {postsService} from "../services/posts-service";
import {postsQueryRepository} from "../repositories/queries/posts-query-repository";

const blogsRouter = Router();

blogsRouter.get('/', async (req: Request, res: Response) => {
    const searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : null;
    const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
    const sortBy = req.query.sortBy ? req.query.sortBy.toString() : "createdAt";
    const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : "desc";
    const blogs: BlogOutputType = await blogsQueryRepository.getFilteredBlogs(searchNameTerm, pageNumber, pageSize, sortBy, sortDirection)
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
        const newBlogId: string | null = await blogsService.createBlog(req.body.name, req.body.youtubeUrl)
        if (newBlogId) {
            const newBlog = await blogsQueryRepository.getBlogById(newBlogId)
            res.status(201).send(newBlog)
            return
        }
        res.sendStatus(404)
        return
    });
blogsRouter.post('/:blogId/posts',
    urlBlogIdValidation,
    isAuthT,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const newPostId: string | null = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.blogId);
        if (newPostId) {
            const newBlog = await postsQueryRepository.getPostById(newPostId)
            res.status(201).send(newBlog)
            return
        } else {
            res.sendStatus(404)
            return
        }
    });
blogsRouter.get('/:blogId/posts',
    urlBlogIdValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const blogId = req.params.blogId;
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : "createdAt";
        const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : sortDirectionEnum.desc;
        const posts = await postsQueryRepository.getAllPostsFor1Blog(blogId, pageNumber, pageSize, sortBy, sortDirection)
        res.send(posts)
        return
    });


blogsRouter.put('/:id',
    isAuthT,
    nameValidation,
    youtubeUrlValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const isUpdated: boolean = await blogsService.updateBlog(req.params.id, req.body.name, req.body.youtubeUrl)
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
        const isDeleted: boolean = await blogsService.deleteBlogById(req.params.id,)
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