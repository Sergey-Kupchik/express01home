import {Request, Response, Router} from 'express';
import {isAuthT} from "../middlewares/isAuth-middleware";
import {nameValidation, websiteUrlValidation} from "../middlewares/blogs-validation-middleware";
import {inputValidationMiddleware, inputValidationMiddleware2} from "../middlewares/validation-middleware";
import {BlogsService, BlogType} from "../services/blogs-service";
import {
    BlogOutputType,
    BlogsQueryRepository,
    sortDirectionEnum
} from "../repositories/queries/blogs-query-repository";
import {
    contentValidation, descriptionValidation,
    shortDescriptionValidation,
    titleValidation,
    urlBlogIdValidation
} from "../middlewares/posts-validation-middleware";
import {PostsService} from "../services/posts-service";
import {PostsQueryRepo} from "../repositories/queries/posts-query-repository";

const blogsRouter = Router();

class BlogsRouter {
    private postsQueryRepository: PostsQueryRepo;
    private postsService: PostsService;
    private blogsQueryRepository: BlogsQueryRepository;
    private blogsService: BlogsService;

    constructor() {
        this.postsQueryRepository = new PostsQueryRepo()
        this.postsService = new PostsService()
        this.blogsQueryRepository = new BlogsQueryRepository()
        this.blogsService = new BlogsService()
    }

    async getFilteredBlogs(req: Request, res: Response) {
        const searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : null;
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : "createdAt";
        const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : "desc";
        const blogs: BlogOutputType = await this.blogsQueryRepository.getFilteredBlogs(searchNameTerm, pageNumber, pageSize, sortBy, sortDirection)
        res.send(blogs)
        return
    }

    async getBlogById(req: Request, res: Response) {
        const blog: BlogType | null = await this.blogsQueryRepository.getBlogById(req.params.id)
        if (!blog) {
            res.sendStatus(404)
            return
        }
        res.send(blog)
        return
    }

    async createBlog(req: Request, res: Response) {
        const newBlogId: string | null = await this.blogsService.createBlog(req.body.name, req.body.websiteUrl, req.body.description)
        if (newBlogId) {
            const newBlog = await this.blogsQueryRepository.getBlogById(newBlogId)
            res.status(201).send(newBlog)
            return
        }
        res.sendStatus(404)
        return
    }

    async createPost(req: Request, res: Response) {
        const newPostId: string | null = await this.postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.blogId);
        if (newPostId) {
            const newBlog = await this.postsQueryRepository.getPostById(newPostId)
            res.status(201).send(newBlog)
            return
        } else {
            res.sendStatus(404)
            return
        }
    }

    async getAllPostsFor1Blog(req: Request, res: Response) {
        const blogId = req.params.blogId;
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : "createdAt";
        const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : sortDirectionEnum.desc;
        const posts = await this.postsQueryRepository.getAllPostsFor1Blog(blogId, pageNumber, pageSize, sortBy, sortDirection)
        res.send(posts)
        return
    }

    async updateBlog(req: Request, res: Response) {
        const isUpdated: boolean = await this.blogsService.updateBlog(req.params.id, req.body.name, req.body.websiteUrl, req.body.description)
        if (!isUpdated) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
        return
    }

    async deleteBlogById(req: Request, res: Response) {
        const isDeleted: boolean = await this.blogsService.deleteBlogById(req.params.id,)
        if (!isDeleted) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
        return
    }
}

const blogs = new BlogsRouter()

blogsRouter.get('/',
    blogs.getFilteredBlogs.bind(blogs)
);

blogsRouter.get('/:id',
    blogs.getBlogById.bind(blogs)
);

blogsRouter.post('/',
    isAuthT,
    nameValidation,
    websiteUrlValidation,
    descriptionValidation,
    inputValidationMiddleware,
    blogs.createBlog.bind(blogs)
);

blogsRouter.post('/:blogId/posts',
    urlBlogIdValidation,
    inputValidationMiddleware2,
    isAuthT,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware,
    blogs.createPost.bind(blogs)
);
blogsRouter.get('/:blogId/posts',
    urlBlogIdValidation,
    inputValidationMiddleware2,
    blogs.getAllPostsFor1Blog.bind(blogs)
);


blogsRouter.put('/:id',
    isAuthT,
    nameValidation,
    websiteUrlValidation,
    descriptionValidation,
    inputValidationMiddleware,
    blogs.updateBlog.bind(blogs)
);

blogsRouter.delete('/:id',
    isAuthT,
    blogs.deleteBlogById.bind(blogs));

export {
    blogsRouter
}