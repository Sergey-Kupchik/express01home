import { injectable, inject } from "inversify";
import { v4 as uuidv4 } from 'uuid';
import { currentDate } from '../utils/utils';
import { PostsRepo } from "../repositories/posts-db-repository";
import { BlogsRepo } from "../repositories/blogs-db-repository";
import { BlogsQueryRepository } from "../repositories/queries/blogs-query-repository";

@injectable()
class PostsService {

    constructor(@inject(PostsRepo) protected postsRepository: PostsRepo,
        @inject(BlogsRepo) protected blogsRepository: BlogsRepo,
        @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository) {

    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string,): Promise<string | null> {
        const blog = await this.blogsQueryRepository.getBlogById(blogId)
        const newPost: PostType = {
            id: uuidv4(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog ? blog.name : "No name",
            createdAt: currentDate(),
        }
        const result = await this.postsRepository.createPost(newPost)
        if (result) {
            return newPost.id
        } else {
            return null;
        }
    }

    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string,): Promise<boolean> {
        const blog = await this.blogsQueryRepository.getBlogById(blogId)
        const postInfo: PostInfoType = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog ? blog.name : "No name"
        }
        const result = await this.postsRepository.updatePost(id, postInfo)
        return result
    }

    async deletePostById(id: string): Promise<boolean> {
        const result = await this.postsRepository.deletePostById(id)
        return result
    }

    async deleteAllPosts(): Promise<boolean> {
        const result = await this.blogsRepository.deleteAllBlogs()
        return result
    }
}


type PostType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
};

type PostInfoType = Omit<PostType, "id" | "createdAt">;

export { PostType, PostInfoType, PostsService }