import {inject, injectable} from "inversify";
import {Like} from "../../server/db/conn";
import {UsersRepo} from "../users-db-repository";

@injectable()
class LikeQueryRepo {
    constructor(
        @inject(UsersRepo) protected usersRepository: UsersRepo,
    ) {
    }

    async getCommentLikeStatus4User(userId: string, commentId: string): Promise<LikeQueryRepoEnum> {
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

    async getPostLikeStatus4User(userId: string, postId: string): Promise<LikeQueryRepoEnum> {
        let status = LikeQueryRepoEnum.None
        const likeInstance = await Like.findOne({
            userId,
            "posts.like": {$elemMatch: {'posts.like.$.postId': postId}}
        }, '-_id  -__v').lean()
        if (likeInstance) status = LikeQueryRepoEnum.Like
        const dislikeInstance = await Like.findOne({
            userId,
            "posts.dislike": {'$in': [postId]}
        }, '-_id  -__v').lean();
        if (dislikeInstance) status = LikeQueryRepoEnum.Dislike
        return status;
    }

    async getLikesCount4Comment(commentId: string): Promise<LikesCountType> {
        const likesCount = await Like.findOne({"comments.like": {'$in': [commentId]}}, '-_id  -__v').count()
        const dislikesCount = await Like.findOne({"comments.dislike": {'$in': [commentId]}}, '-_id  -__v').count();
        const countInfo = {likesCount, dislikesCount}
        return countInfo
    }

    async getLikesCount4Post(postId: string): Promise<LikesCountType> {
        const likesCount = await Like.findOne({"posts.like": {$elemMatch: {"postId": postId}}}, '-_id  -__v').count()
        const dislikesCount = await Like.findOne({"posts.dislike": {'$in': [postId]}}, '-_id  -__v').count();
        const countInfo = {likesCount, dislikesCount}
        return countInfo
    }

    async deleteAllInstance(): Promise<boolean> {
        const resultDoc = await Like.deleteMany()
        return resultDoc.acknowledged;
    }

    async getNewestLikes4Post(postId: string): Promise<INewestLikes[]> {
        const unfilteredUsers = await Like.find({"posts.like": {$elemMatch: {"postId": postId}}}, '-_id  -__v -posts.dislike -comments').lean()
        const filteredUsers = await Promise.all(unfilteredUsers.map((i) => {
                let selectedPost = i.posts.like.find(p => p.postId === postId)
                let noLoginItem = {
                    userId: i.userId,
                    addedAt: selectedPost?.addedAt
                }
                return noLoginItem
            })
                //@ts-ignore
                .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
                .slice(0, 3)
                .map(async (e) => {
                    let user = await this.usersRepository.findUserById(e.userId)
                    let loginItem = {
                        addedAt: e.addedAt!,
                        userId: e.userId!,
                        login: user!.accountData.login!
                    }
                    return loginItem
                })
        )
        return filteredUsers
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

type INewestLikes = {
    addedAt: string
    userId: string
    login: string
}


export {
    LikeQueryRepo, LikeQueryRepoEnum, INewestLikes
};

