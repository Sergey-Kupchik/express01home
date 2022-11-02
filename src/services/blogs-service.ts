import {v4 as uuidv4} from "uuid";
import {currentDate} from "../utils/utils";
import {blogsRepository} from "../repositories/blogs-db-repository";

type BlogType = {
    id: string
    name: string
    youtubeUrl: string
    createdAt: string
}
const blogsService = {
    async getAllBlogs(): Promise<BlogType[]> {
        const blogs = await blogsRepository.getAllBlogs()
        return blogs;
    },
    async getBlogById(id: string): Promise<BlogType | null> {
        const result = await blogsRepository.getBlogById(id)
        return result;
    },
    async createBlog(name: string, youtubeUrl: string): Promise<BlogType | null> {
        const newBlog: BlogType = {
            id: uuidv4(),
            name,
            youtubeUrl,
            createdAt: currentDate(),
        }
        const newBlogFromDb = await blogsRepository.createBlog(newBlog)
        return newBlogFromDb;
    },
    async updateBlog(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await blogsRepository.updateBlog(id, name, youtubeUrl)
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