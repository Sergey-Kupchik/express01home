import {dbCollections, Post, User} from "../server/db/conn";
import {PostInfoType, PostType} from "../services/posts-service";


const postsRepository = {
    async createPost(newPost: PostType): Promise<boolean> {
        // const result = await dbCollections.posts.insertOne(newPost)
        const post = new Post(newPost);
        const savedDoc = await post.save();
        return savedDoc.id === newPost.id;
    },
    async updatePost(id: string, postInfo: PostInfoType): Promise<boolean> {
        // const result = await dbCollections.posts.updateOne({id}, {$set: postInfo})
        const user = await Post.findOneAndUpdate({"id": id}, {$set: postInfo}, {new: true});
        return true
    },
    async deletePostById(id: string): Promise<boolean> {
        // const result = await dbCollections.posts.deleteOne({id})
        const result = await Post.deleteOne({"id": id});
        return result.deletedCount === 1
    },
    async deleteAllPosts(): Promise<boolean> {
        // const result = await dbCollections.posts.deleteMany({})
        const resultDoc = await Post.deleteMany()
        return resultDoc.acknowledged;
    },
};

export {postsRepository}