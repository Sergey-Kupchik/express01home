import {Request, Response, Router} from 'express';
import {BlogType} from "../services/blogs-service";
import {BlogOutputType, blogsQueryRepository, sortDirectionEnum} from "../repositories/queries/blogs-query-repository";
import {isAuthT} from "../middlewares/isAuth-middleware";
import {nameValidation, youtubeUrlValidation} from "../middlewares/blogs-validation-middleware";
import {inputValidationMiddleware} from "../middlewares/validation-middleware";
import {
    contentValidation,
    shortDescriptionValidation,
    titleValidation,
    urlBlogIdValidation
} from "../middlewares/posts-validation-middleware";
import {postsService} from "../services/posts-service";
import {postsQueryRepository} from "../repositories/queries/posts-query-repository";

const filteredBlogsRouter = Router();

// filteredBlogsRouter.get('/', async (req: Request, res: Response) => {
//     const blogs:BlogOutputType  = await blogsQueryRepository.getFilteredBlogs(1, 10, "createdAt","desc")
//     res.send(blogs)
//     return
// });

filteredBlogsRouter.get('/', async (req: Request, res: Response) => {
    const searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : null;
    const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
    const sortBy = req.query.sortBy ? req.query.sortBy.toString() : "createdAt";
    const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : "desc";
    const blogs: BlogOutputType = await blogsQueryRepository.getFilteredBlogs(searchNameTerm, pageNumber, pageSize, sortBy, sortDirection)
    res.send(blogs)
    return
});

filteredBlogsRouter.post('/:blogId/posts',
    isAuthT,
    urlBlogIdValidation,
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
            res.sendStatus(204)
            return
        }
    });
filteredBlogsRouter.get('/:blogId/posts',
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

export {
    filteredBlogsRouter
}