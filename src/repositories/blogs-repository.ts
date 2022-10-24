import {newId} from "../routes/videos-router";

type BlogType = {
    id: string
    name: string
    youtubeUrl: string
}

const blogs: BlogType[] = [
    {
        id: "1",
        name: "Blog1",
        youtubeUrl: "https://www.youtube.com/watch?v=ae6LWyidPJo&ab_channel=AllianceTheatre",
    },
    {
        id: "2",
        name: "Blog2",
        youtubeUrl: "https://www.youtube.com/watch?v=OvgqJOWGQfU&ab_channel=HouzzTV",
    }
];

const blogsRepository = {
    getAllBlogs(): BlogType[] {
        return blogs;
    },
    getBlogById(id: string): BlogType | undefined {
        const searchResult = blogs.find((b) => b.id === id)
        return searchResult;
    },
    createProduct(name: string, youtubeUrl: string): BlogType {
        const newBlog: BlogType = {
            id: newId().toString(),
            name,
            youtubeUrl
        }
        blogs.push(newBlog)
        return newBlog;
    },
    updateBlog(id: string, name: string, youtubeUrl: string): boolean {
        const searchResult = blogs.find((b) => b.id === id)
        if (searchResult) {
            searchResult.name = name;
            searchResult.youtubeUrl = youtubeUrl;
            return true
        }
        return false
    },
    deleteBlogById(id: string): boolean {
        for (let i=0;i<blogs.length;i++){
            if (blogs[i].id===id){
                blogs.splice(i, 1)
                return true
            }
        }
        return false;
    },
}


export {
    blogsRepository, BlogType, blogs
}