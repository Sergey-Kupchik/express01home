import {dbCollections} from "../server/db/conn";
import {BlogType} from "../services/blogs-service";




const blogsRepository = {
    async getAllBlogs(): Promise<BlogType[]> {
        const blogs = await dbCollections.blogs.find({},{ projection:{_id:0}}).toArray()
        return blogs;
    },
    async getBlogById(id: string): Promise<BlogType | null> {
        const result = await dbCollections.blogs.findOne({id},{ projection:{_id:0}})
        return result;
    },
    async createBlog(newBlog: BlogType): Promise<BlogType|null> {
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
    blogsRepository
}