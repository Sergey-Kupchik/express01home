import {v4 as uuidv4} from 'uuid';
import {currentDate} from '../utils/utils';
import {postsRepository} from "../repositories/posts-db-repository";
import {blogsRepository} from "../repositories/blogs-db-repository";


type PostType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
};

type PostInfoType = Omit<PostType, "id" | "createdAt" >;
const postsService = {
    async getAllPosts(): Promise<PostType[]> {
        return await postsRepository.getAllPosts();
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string,): Promise<PostType| null> {
        const blog = await blogsRepository.getBlogById(blogId)
        const newPost: PostType = {
            id: uuidv4(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog ? blog.name : "No name",
            createdAt: currentDate(),
        }
        const result = await postsRepository.createPost(newPost)
        console.log(`result createPost from postsRepository is ${result}`)
        const newPostFromDb = await this.getPostById(newPost.id)
        return newPostFromDb;
    },
    async getPostById(id: string): Promise<PostType | null> {
        const searchResult = await postsRepository.getPostById(id)
        return searchResult;
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string,): Promise<boolean> {
        const blog = await blogsRepository.getBlogById(blogId)
        const postInfo:PostInfoType = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog ? blog.name : "No name"
        }
        const result = await postsRepository.updatePost(id, postInfo)
        return result
    },
    async deletePostById(id: string): Promise<boolean> {
        const result = await postsRepository.deletePostById(id)
        return result
    },
    async deleteAllPosts(): Promise<boolean> {
        const result = await blogsRepository.deleteAllBlogs()
        return result
    },
};

export {postsService, PostType, PostInfoType}