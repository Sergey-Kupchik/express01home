import {Like} from "../server/db/conn";


class LikeRepo {
    async createInstance(userId: string,):Promise<boolean> {
        const instance = new Like({
            userId,
            comments: {
                like: [],
                dislike: [],
            }
        });
        await instance.save()
        if (instance) return true
        return false
    }

    async addCommentLike(userId: string, commentId: string): Promise<boolean> {
        const instance = await Like.findOneAndUpdate({"userId": userId}, {$push: {"comments.like": commentId}}, {new: true});
        if (!instance) {return false}
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

}

export {
    LikeRepo
}

