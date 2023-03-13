import {injectable} from "inversify";
import {Like} from "../server/db/conn";
import {currentDate} from "../utils/utils";

@injectable()
class LikeRepo {
    async createInstance(userId: string,): Promise<boolean> {
        const instance = new Like({
            userId,
        });
        await instance.save()
        if (instance) return true
        return false
    }

    async addCommentLike(userId: string, commentId: string): Promise<boolean> {
        const instance = await Like.findOneAndUpdate({"userId": userId}, {$push: {"comments.like": commentId}}, {new: true});
        if (!instance) {
            return false
        }
        return true
    }

    async addCommentDislike(userId: string, commentId: string): Promise<boolean> {
        const instance = await Like.findOneAndUpdate({"userId": userId}, {$push: {"comments.dislike": commentId}}, {new: true});
        if (!instance) return false
        return true
    }

    async removeCommentLike(userId: string, commentId: string): Promise<boolean> {
        await Like.findOneAndUpdate({userId,}, {'$pull': {'comments.like': {'$in': [commentId]}}})
        return true;
    }

    async removeCommentDislike(userId: string, commentId: string): Promise<boolean> {
        await Like.findOneAndUpdate({userId,}, {'$pull': {'comments.dislike': {'$in': [commentId]}}})
        return true;
    }

    async addPostLike(userId: string, postId: string): Promise<boolean> {
        const instance = await Like.findOneAndUpdate({"userId": userId}, {
            $push: {
                "posts.like": {
                    postId: postId,
                    addedAt: currentDate(),
                }
            }
        }, {new: true});
        if (!instance) {
            return false
        }
        return true
    }

    async addPostDislike(userId: string, postId: string): Promise<boolean> {
        const instance = await Like.findOneAndUpdate({"userId": userId}, {$push: {"posts.dislike": postId}}, {new: true});
        if (!instance) return false
        return true
    }

    async removePostLike(userId: string, postId: string): Promise<boolean> {
        await Like.findOneAndUpdate({
            "userId": userId,
        },
        {'$pull': {'posts.like': {'postId': {'$in': [postId]}}}}

        )
        return true;
    }

    async removePostDislike(userId: string, postId: string): Promise<boolean> {
        await Like.findOneAndUpdate({userId,}, {'$pull': {'posts.dislike': {'$in': [postId]}}})
        return true;
    }
}

export {
    LikeRepo
};

