import {newId} from "../routes/videos-router";
import {dbCollections} from "../server/db/conn";
import {v4 as uuidv4} from "uuid";
import { currentDate } from "../utils/utils";

type BlogType = {
    id: string
    name: string
    youtubeUrl: string
    createdAt: string
}


const blogsRepository = {
    async getAllBlogs(): Promise<BlogType[]> {
        const blogs = await dbCollections.blogs.find({},{ projection:{_id:0}}).toArray()
        return blogs;
    },
    async getBlogById(id: string): Promise<BlogType | null> {
        const result = await dbCollections.blogs.findOne({id},{ projection:{_id:0}})
        return result;
    },
    async createBlog(name: string, youtubeUrl: string): Promise<BlogType|null> {
        const newBlog: BlogType = {
            id: uuidv4(),
            name,
            youtubeUrl,
            createdAt: currentDate(),
        }
        await dbCollections.blogs.insertOne(newBlog)
        const newBlogFromDb = await this.getBlogById(newBlog.id)
        return newBlogFromDb;
    },
    async updateBlog(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await dbCollections.blogs.updateOne({id}, {
            $set: {
                name,
                youtubeUrl,
            }
        })
        return result.modifiedCount === 1;
    },
    async deleteBlogById(id: string): Promise<boolean> {
        const result = await dbCollections.blogs.deleteOne({id})
        return result.deletedCount === 1;
    },
    async deleteAllBlogs(): Promise<boolean> {
        const result = await dbCollections.blogs.deleteMany({})
        return result.deletedCount >= 0;
    }
}


export {
    blogsRepository, BlogType
}