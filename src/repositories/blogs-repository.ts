import {newId} from "../routes/videos-router";

type BlogType = {
    id: string
    name: string
    youtubeUrl: string
}

const blogs: BlogType[] = [
    {
        id: "1",
        name: "BlogAsync",
        youtubeUrl: "https://www.youtube.com/watch?v=ae6LWyidPJo&ab_channel=AllianceTheatre",
    },
    {
        id: "2",
        name: "Blog2",
        youtubeUrl: "https://www.youtube.com/watch?v=OvgqJOWGQfU&ab_channel=HouzzTV",
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
    async createProduct(name: string, youtubeUrl: string):  Promise<BlogType> {
        const newBlog: BlogType = {
            id: newId().toString(),
            name,
            youtubeUrl
        }
        blogs.push(newBlog)
        return newBlog;
    },
    async updateBlog(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const searchResult = blogs.find((b) => b.id === id)
        if (searchResult) {
            searchResult.name = name;
            searchResult.youtubeUrl = youtubeUrl;
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
    blogsRepository, BlogType
}