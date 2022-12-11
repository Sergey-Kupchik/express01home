import {newId} from "../../routes/videos-router";
import { currentDate } from "../../utils/utils";
import {BlogType} from "../../services/blogs-service";



const blogs: BlogType[] = [
    {
        id: "1",
        name: "BlogAsync",
        createdAt: currentDate(),
        websiteUrl: "https://www.youtube.com/watch?v=ae6LWyidPJo&ab_channel=AllianceTheatre",
        description:"wqqwq"
    },
    {
        id: "2",
        name: "Blog2",
        createdAt: currentDate(),
        websiteUrl: "https://www.youtube.com/watch?v=OvgqJOWGQfU&ab_channel=HouzzTV",
        description:"wqqwq"
    }
];

const blogsRepository = {
    async getAllBlogs(): Promise<BlogType[]> {
        return blogs;
    },
    async getBlogById(id: string):  Promise<BlogType | undefined> {
        const searchResult = blogs.find((b) => b.id === id)
        return searchResult;
    },
    async createProduct(name: string, websiteUrl: string, description:string):  Promise<BlogType> {
        const newBlog: BlogType = {
            id: newId().toString(),
            name,
            websiteUrl,
            createdAt: currentDate(),
            description
        }
        blogs.push(newBlog)
        return newBlog;
    },
    async updateBlog(id: string, name: string, websiteUrl: string): Promise<boolean> {
        const searchResult = blogs.find((b) => b.id === id)
        if (searchResult) {
            searchResult.name = name;
            searchResult.websiteUrl = websiteUrl;
            return true
        }
        return false
    },
    async deleteBlogById(id: string): Promise<boolean> {
        for (let i=0;i<blogs.length;i++){
            if (blogs[i].id===id){
                blogs.splice(i, 1)
                return true
            }
        }
        return false;
    },
    async deleteAllBlogs (): Promise<boolean> {
        blogs.splice(0, blogs.length);
        return true
    }
}


export {
    blogsRepository
}