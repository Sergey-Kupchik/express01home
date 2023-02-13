import {v4 as uuidv4} from "uuid";
import {currentDate} from "../utils/utils";
import {BlogsRepo} from "../repositories/blogs-db-repository";

type BlogType = {
    id: string
    name: string
    websiteUrl: string
    createdAt: string
    description: string
}

class BlogsService {
    constructor(protected blogsRepository: BlogsRepo
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

export {BlogType, BlogsService}