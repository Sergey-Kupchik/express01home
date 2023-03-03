import { inject, injectable } from "inversify";
import { v4 as uuidv4 } from "uuid";
import { BlogsRepo } from "../repositories/blogs-db-repository";
import { currentDate } from "../utils/utils";

@injectable()
class BlogsService {
    constructor(
        @inject(BlogsRepo) protected blogsRepository: BlogsRepo
    ) {
    }

    async createBlog(name: string, websiteUrl: string, description: string): Promise<string | null> {
        const newBlog: BlogType = {
            id: uuidv4(),
            name,
            websiteUrl,
            createdAt: currentDate(),
            description
        }
        const resp = await this.blogsRepository.createBlog(newBlog)
        if (resp) {
            return newBlog.id;
        } else {
            return null
        }

    }

    async updateBlog(id: string, name: string, websiteUrl: string, description: string): Promise<boolean> {
        const result = await this.blogsRepository.updateBlog(id, name, websiteUrl, description)
        return result;
    }

    async deleteBlogById(id: string): Promise<boolean> {
        const result = await this.blogsRepository.deleteBlogById(id)
        return result;
    }

    async deleteAllBlogs(): Promise<boolean> {
        const result = await this.blogsRepository.deleteAllBlogs()
        return result;
    }
}

type BlogType = {
    id: string
    name: string
    websiteUrl: string
    createdAt: string
    description: string
}


export { BlogType, BlogsService };
