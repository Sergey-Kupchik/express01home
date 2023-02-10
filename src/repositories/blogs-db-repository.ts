import {Blog} from "../server/db/conn";
import {BlogType} from "../services/blogs-service";

class BlogsRepo {
    async createBlog(newBlog: BlogType): Promise<boolean> {
        const blog = new Blog(newBlog);
        const savedDoc = await blog.save();
        return savedDoc.id === newBlog.id;
    }

    async updateBlog(id: string, name: string, websiteUrl: string, description: string): Promise<boolean> {
        const blog = await Blog.findOneAndUpdate({"id": id}, {
            $set: {
                name,
                websiteUrl,
                description,
            }
        }, {new: true});
        return true;
    }

    async deleteBlogById(id: string): Promise<boolean> {
        const result = await Blog.deleteOne({"id": id});
        return result.deletedCount === 1

    }

    async deleteAllBlogs(): Promise<boolean> {
        const resultDoc = await Blog.deleteMany()
        return resultDoc.acknowledged;
    }
}



export {
    BlogsRepo
}