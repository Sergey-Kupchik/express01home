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
        title: 'Title1',
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
    getAllPosts(): PostType[] {
        return posts;
    },
    createPost(title: string, shortDescription: string, content: string, blogId: string,): PostType {
        const newPost: PostType = {
            id: uuidv4(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blogsRepository.getBlogById(blogId)!.name
        }
        posts.push(newPost)
        return newPost;
    },
    getPostById(id: string): PostType | undefined {
        const searchResult = posts.find((p) => p.id === id)
        return searchResult;
    },
    updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string,): boolean {
        const searchResult = posts.find((p) => p.id === id)
        if (searchResult) {
            searchResult.title = title;
            searchResult.shortDescription = shortDescription;
            searchResult.content = content;
            searchResult.blogId = blogId;
            searchResult.blogName= blogsRepository.getBlogById(blogId)!.name;
            return true
        }
        return false
    },
    deletePostById(id: string): boolean {
        for (let i=0;i<posts.length;i++){
            if (posts[i].id===id){
                posts.splice(i, 1)
                return true
            }
        }
        return false;
    },
};

export {postsRepository, PostType, posts}