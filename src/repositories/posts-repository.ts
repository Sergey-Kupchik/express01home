import {newId} from "../routes/videos-router";
import {v4 as uuidv4} from 'uuid';
import {blogsRepository, BlogType} from "./blogs-repository";

type PostType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
};

const posts: PostType[] = [
    {
        id: "1",
        title: 'TitleAsync',
        shortDescription: 'blblblblbblbl',
        content: "https://www.youtube.com/watch?v=JdTsAmOP80c&t=487s&ab_channel=ImagineDragonsLive",
        blogId: uuidv4(),
        blogName: 'Name1'
    },
    {
        id: "2",
        title: 'Title2',
        shortDescription: 'affddfa',
        content: "https://learn.javascript.ru/array-methods",
        blogId: uuidv4(),
        blogName: 'Name2'
    }
];

const postsRepository = {
    async getAllPosts(): Promise<PostType[]> {
        return posts;
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string,): Promise<PostType> {
        const blog = await blogsRepository.getBlogById(blogId)
        const newPost: PostType = {
            id: uuidv4(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog ? blog.name : "No name"
        }
        posts.push(newPost)
        return newPost;
    },
    async getPostById(id: string): Promise<PostType | undefined> {
        const searchResult = posts.find((p) => p.id === id)
        return searchResult;
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string,): Promise<boolean> {
        const searchResult = posts.find((p) => p.id === id)
        const blog = await blogsRepository.getBlogById(blogId)
        if (searchResult) {
            searchResult.title = title;
            searchResult.shortDescription = shortDescription;
            searchResult.content = content;
            searchResult.blogId = blogId;
            searchResult.blogName = blog ? blog.name : "No name"
            return true
        }
        return false
    },
    async deletePostById(id: string): Promise<boolean> {
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].id === id) {
                posts.splice(i, 1)
                return true
            }
        }
        return false;
    },
    async deleteAllPosts(): Promise<boolean> {
        posts.splice(0, posts.length);
        return true
    },
};

export {postsRepository, PostType}