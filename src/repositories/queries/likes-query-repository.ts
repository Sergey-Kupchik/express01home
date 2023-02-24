import {Like} from "../../server/db/conn";

class LikeQueryRepo {
    async getLikeStatus4User(userId: string, commentId: string): Promise<LikeQueryRepoEnum> {
        let status = LikeQueryRepoEnum.None
        const likeInstance = await Like.findOne({userId, "comments.like": {'$in': [commentId]}}, '-_id  -__v').lean()
        if (likeInstance) status = LikeQueryRepoEnum.Like
        const dislikeInstance = await Like.findOne({
            userId,
            "comments.dislike": {'$in': [commentId]}
        }, '-_id  -__v').lean();
        if (dislikeInstance) status = LikeQueryRepoEnum.Dislike
        return status;
    }
    async getLikesCount4Comment(commentId: string): Promise<LikesCountType> {
        const likesCount = await Like.findOne({ "comments.like": {'$in': [commentId]}}, '-_id  -__v').count()
        const dislikesCount = await Like.findOne({"comments.dislike": {'$in': [commentId]}}, '-_id  -__v').count();
        const countInfo = {likesCount,dislikesCount}
        return countInfo
    }
    async deleteAllInstance(): Promise<boolean> {
        const resultDoc = await Like.deleteMany()
        return resultDoc.acknowledged;
    }
}

type LikesCountType = {
    likesCount: number
    dislikesCount: number
}

enum LikeQueryRepoEnum {
    None = "None",
    Like = "Like",
    Dislike = "Dislike"
}


export {
    LikeQueryRepo
}

