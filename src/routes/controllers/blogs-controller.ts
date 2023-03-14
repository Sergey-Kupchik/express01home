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
            const newBlog = await this.postsQueryRepository.getExtendedPostInfoById({ postId: newPostId, userId: req.user?.accountData.id })
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

// let f = {
//     "id": "c52b4595-30e2-42b7-ae52-8f18f2b1ab5f",
//     "title": "post title",
//     "shortDescription": "description",
//     "content": "new post content",
//     "blogId": "14a3c743-50a9-4342-b26d-1c82e9b876f0",
//     "blogName": "new blog", "createdAt": "2023-03-13T19:33:24.947Z",
//     "extendedLikesInfo": {
//         "likesCount": 1, "dislikesCount": 1,
//         "myStatus": "Like", 
//         "newestLikes": [{
//             "addedAt": Any<String>,
//             "userId": "968d504a-0ae7-4ce2-9505-134ffb7eb5d9", 
//             "login": "7515lg"
//         }]
//     }
// }
// let f1 = {
//     "id":"c52b4595-30e2-42b7-ae52-8f18f2b1ab5f",
//     "title":"post title",
//     "shortDescription":"description",
//     "content":"new post content",
//     "blogId":"14a3c743-50a9-4342-b26d-1c82e9b876f0",
//     "blogName":"new blog",
//     "createdAt":"2023-03-13T19:33:24.947Z",
//     "extendedLikesInfo":
//     {"likesCount":0,"dislikesCount":1,
//     "myStatus":"Like",
//     "newestLikes":[]}}