import {Like} from "../server/db/conn";


class LikeRepo {
    async createLikeInstance(userId: string,) {
        const instance = new Like({
            userId,
            comments: {
                like: [],
                dislike: [],
            }
        });
    }

    async addLike(userId: string, commentId: string): Promise<boolean> {
        const instance = await Like.findOne({userId}, '-_id  -__v');
        if (!instance) return false
        instance.comments.like.push(commentId);
        await instance.save()
        return true
    }

    async addDislike(userId: string, commentId: string): Promise<boolean> {
        const instance = await Like.findOne({userId}, '-_id  -__v');
        if (!instance) return false
        instance.comments.dislike.push(commentId);
        await instance.save()
        return true
    }

    async removeLike(userId: string, commentId: string): Promise<boolean> {
        await Like.findOneAndUpdate({userId,}, {'$pull': {'comments.like': {'$in': [commentId]}}})
        return true;
        // const instance = await Like.findOneAndUpdate({userId}, '-_id  -__v');
        // if (!instance) return false
        // instance.comments.like.pull(commentId);
        // await instance.save()
        // return true
    }

    async removeDislike(userId: string, commentId: string): Promise<boolean> {
        await Like.findOneAndUpdate({userId,}, {'$pull': {'comments.dislike': {'$in': [commentId]}}})
        return true;
        // const instance = await Like.findOne({userId}, '-_id  -__v');
        // if (!instance) return false
        // instance.comments.dislike.pull(commentId);
        // await instance.save()
        // return true
    }

}

export {
    LikeRepo
}

