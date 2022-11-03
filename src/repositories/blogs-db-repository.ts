import {dbCollections} from "../server/db/conn";
import {BlogType} from "../services/blogs-service";
import {blogsQueryRepository} from "./queries/blogs-query-repository";




const blogsRepository = {
    async createBlog(newBlog: BlogType): Promise<BlogType|null> {
        await dbCollections.blogs.insertOne(newBlog)
        const newBlogFromDb = await blogsQueryRepository.getBlogById(newBlog.id)
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
    blogsRepository
}