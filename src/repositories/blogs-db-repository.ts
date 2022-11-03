import {dbCollections} from "../server/db/conn";
import {BlogType} from "../services/blogs-service";




const blogsRepository = {
    async createBlog(newBlog: BlogType): Promise<boolean> {
        const resp = await dbCollections.blogs.insertOne(newBlog)
        return resp.acknowledged;
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