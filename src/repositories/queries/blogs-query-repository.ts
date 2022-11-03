import {dbCollections} from "../../server/db/conn";
import {BlogType} from "../../services/blogs-service";




const blogsQueryRepository = {
    async getAllBlogs(): Promise<BlogType[]> {
        const blogs = await dbCollections.blogs.find({},{ projection:{_id:0}}).toArray()
        return blogs;
    },
    async getBlogById(id: string): Promise<BlogType | null> {
        const result = await dbCollections.blogs.findOne({id},{ projection:{_id:0}})
        return result;
    },
}


export {
    blogsQueryRepository
}