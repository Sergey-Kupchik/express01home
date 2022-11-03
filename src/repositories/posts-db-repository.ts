import {dbCollections} from "../server/db/conn";
import {PostInfoType, PostType} from "../services/posts-service";
import {postsQueryRepository} from "./queries/posts-query-repository";


const postsRepository = {
    async createPost(newPost: PostType): Promise<PostType| null> {
        const result = await dbCollections.posts.insertOne(newPost)
        const newPostFromDb = await postsQueryRepository.getPostById(newPost.id)
        return newPostFromDb;
    },
    async updatePost(id: string, postInfo: PostInfoType): Promise<boolean> {
        const result = await dbCollections.posts.updateOne({id}, {
            $set: postInfo
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

export {postsRepository}