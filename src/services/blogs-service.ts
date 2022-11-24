import {v4 as uuidv4} from "uuid";
import {currentDate} from "../utils/utils";
import {blogsRepository} from "../repositories/blogs-db-repository";

type BlogType = {
    id: string
    name: string
    websiteUrl: string
    createdAt: string
}
const blogsService = {
    async createBlog(name: string, websiteUrl: string): Promise<string|null> {
        const newBlog: BlogType = {
            id: uuidv4(),
            name,
            websiteUrl,
            createdAt: currentDate(),
        }
        const resp = await blogsRepository.createBlog(newBlog)
        if (resp) {
            return newBlog.id;
        } else {
            return null
        }

    },
    async updateBlog(id: string, name: string, websiteUrl: string): Promise<boolean> {
        const result = await blogsRepository.updateBlog(id, name, websiteUrl)
        return result;
    },
    async deleteBlogById(id: string): Promise<boolean> {
        const result = await blogsRepository.deleteBlogById(id)
        return result;
    },
    async deleteAllBlogs(): Promise<boolean> {
        const result = await blogsRepository.deleteAllBlogs()
        return result;
    }
}


export {blogsService, BlogType}