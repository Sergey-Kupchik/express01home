import {Like} from "../../server/db/conn";

class LikeQueryRepo {
    async getLikeStatus4User(userId: string, commentId: string): Promise<LikeEnum> {
        let status = LikeEnum.None
        const likeInstance = await Like.findOne({userId, "comments.like": {'$in': [commentId]}}, '-_id  -__v').lean()
        if (likeInstance) status = LikeEnum.Like
        const dislikeInstance = await Like.findOne({
            userId,
            "comments.dislike": {'$in': [commentId]}
        }, '-_id  -__v').lean();
        if (dislikeInstance) status = LikeEnum.Dislike
        return status;
    }
    async getLikesCount4Comment(commentId: string): Promise<LikesCountType> {
        const likesCount = await Like.findOne({ "comments.like": {'$in': [commentId]}}, '-_id  -__v').count()
        const dislikesCount = await Like.findOne({"comments.dislike": {'$in': [commentId]}}, '-_id  -__v').count();
        const countInfo = {likesCount,dislikesCount}
        return countInfo
    }
}

type LikesCountType = {
    likesCount: number
    dislikesCount: number
}

enum LikeEnum {
    None = "None",
    Like = "Like",
    Dislike = "Dislike"
}


export {
    LikeQueryRepo
}

