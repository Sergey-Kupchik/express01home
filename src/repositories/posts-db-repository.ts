import {v4 as uuidv4} from 'uuid';
import {blogsRepository} from "./blogs-db-repository";
import {dbCollections} from "../server/db/conn";
import { currentDate } from '../utils/utils';



type PostType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
};


const postsRepository = {
    async getAllPosts(): Promise<PostType[]> {
        return await dbCollections.posts.find({},{ projection:{_id:0}}).toArray();
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
        const result = await dbCollections.posts.insertOne(newPost)
        console.log(`result createPost from postsRepository is ${result}`)
        const newPostFromDb = await this.getPostById(newPost.id)
        return newPostFromDb;
    },
    async getPostById(id: string): Promise<PostType | null> {
        const searchResult = await dbCollections.posts.findOne({id},{ projection:{_id:0}})
        return searchResult;
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string,): Promise<boolean> {
        const blog = await blogsRepository.getBlogById(blogId)
        const result = await dbCollections.posts.updateOne({id}, {
            $set: {
                title,
                shortDescription,
                content,
                blogId,
                blogName: blog ? blog.name : "No name"
            }
        })
        return result.matchedCount === 1
    },
    async deletePostById(id: string): Promise<boolean> {
        const result = await dbCollections.posts.deleteOne({id})
        return result.deletedCount === 1
    },
    async deleteAllPosts(): Promise<boolean> {
        const result = await dbCollections.posts.deleteMany({})
        return result.deletedCount >= 0
    },
};

export {postsRepository, PostType}