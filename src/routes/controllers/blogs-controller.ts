import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import {
    BlogOutputType,
    BlogsQueryRepository,
    sortDirectionEnum
} from "../../repositories/queries/blogs-query-repository";
import { PostsQueryRepo } from "../../repositories/queries/posts-query-repository";
import { BlogsService, BlogType } from "../../services/blogs-service";
import { PostsService } from "../../services/posts-service";

@injectable()
export class BlogsController {

    constructor(
        @inject(PostsQueryRepo) protected postsQueryRepository: PostsQueryRepo,
        @inject(PostsService) protected postsService: PostsService,
        @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
        @inject(BlogsService) protected blogsService: BlogsService,
    ) {
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
        const posts = await this.postsQueryRepository.getAllPostsFor1Blog(blogId, pageNumber, pageSize, sortBy, sortDirection, req.user?.accountData.id)
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

