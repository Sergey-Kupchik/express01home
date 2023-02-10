import {Post} from "../server/db/conn";
import {PostInfoType, PostType} from "../services/posts-service";

class PostsRepo {
    async createPost(newPost: PostType): Promise<boolean> {
        const post = new Post(newPost);
        const savedDoc = await post.save();
        return savedDoc.id === newPost.id;
    }

    async updatePost(id: string, postInfo: PostInfoType): Promise<boolean> {
        const user = await Post.findOneAndUpdate({"id": id}, {$set: postInfo}, {new: true});
        return true
    }

    async deletePostById(id: string): Promise<boolean> {
        const result = await Post.deleteOne({"id": id});
        return result.deletedCount === 1
    }

    async deleteAllPosts(): Promise<boolean> {
        const resultDoc = await Post.deleteMany()
        return resultDoc.acknowledged;
    }
}


export {PostsRepo}