import { injectable, inject } from "inversify";
import { LikeRepo } from "../repositories/likes-db-repository";
import { LikeQueryRepo } from "../repositories/queries/likes-query-repository";

@injectable()
class LikesService {

    constructor(
        @inject(LikeRepo) protected likesRepository: LikeRepo,
        @inject(LikeQueryRepo) protected likesQueryRepository: LikeQueryRepo,
    ) {
    }

    async createInstance(userId: string,): Promise<boolean> {
        const instance = await this.likesRepository.createInstance(userId)
        if (instance) return true
        return false
    }

    async likeDislikeComment(userId: string, commentId: string, actionType: LikeActionEnum): Promise<boolean> {
        let hasBeenUp = false
        const currentStatus = await this.likesQueryRepository.getCommentLikeStatus4User(userId, commentId)
        // @ts-ignore
        if (actionType === currentStatus) {
            hasBeenUp = true
        } else {
            if (actionType === LikeActionEnum.Like) {
                await this._removeCommentDislike(userId, commentId)
                hasBeenUp = await this._addCommentLike(userId, commentId)
            }
            if (actionType === LikeActionEnum.Dislike) {
                await this._removeCommentLike(userId, commentId)
                hasBeenUp = await this._addCommentDislike(userId, commentId)
            }
            if (actionType === LikeActionEnum.None) {
                await this._removeCommentLike(userId, commentId)
                await this._removeCommentDislike(userId, commentId)
                hasBeenUp = true
            }
        }
        return hasBeenUp
    }

    async _removeCommentLike(userId: string, commentId: string): Promise<boolean> {
        const instance = await this.likesRepository.removeCommentLike(userId, commentId)
        if (instance) return true
        return false
    }

    async _removeCommentDislike(userId: string, commentId: string): Promise<boolean> {
        const instance = await this.likesRepository.removeCommentDislike(userId, commentId)
        if (instance) return true
        return false
    }

    async _addCommentLike(userId: string, commentId: string): Promise<boolean> {
        const instance = await this.likesRepository.addCommentLike(userId, commentId)
        if (instance) return true
        return false
    }

    async _addCommentDislike(userId: string, commentId: string): Promise<boolean> {
        await this._removeCommentLike(userId, commentId)
        const instance = await this.likesRepository.addCommentDislike(userId, commentId)
        if (instance) return true
        return false
    }
    async likeDislikePost(userId: string, postId: string, actionType: LikeActionEnum): Promise<boolean> {
        let hasBeenUp = false
        const currentStatus = await this.likesQueryRepository.getPostLikeStatus4User(userId, postId)
        // @ts-ignore
        if (actionType === currentStatus) {
            hasBeenUp = true
        } else {
            if (actionType === LikeActionEnum.Like) {
                await this._removePostDislike(userId, postId)
                hasBeenUp = await this._addPostLike(userId, postId)
            }
            if (actionType === LikeActionEnum.Dislike) {
                await this._removePostLike(userId, postId)
                hasBeenUp = await this._addPostDislike(userId, postId)
            }
            if (actionType === LikeActionEnum.None) {
                await this._removePostLike(userId, postId)
                await this._removePostDislike(userId, postId)
                hasBeenUp = true
            }
        }
        return hasBeenUp
    }
    async _removePostLike(userId: string, postId: string): Promise<boolean> {
        const instance = await this.likesRepository.removePostLike(userId, postId)
        if (instance) return true
        return false
    }

    async _removePostDislike(userId: string, postId: string): Promise<boolean> {
        const instance = await this.likesRepository.removePostDislike(userId, postId)
        if (instance) return true
        return false
    }

    async _addPostLike(userId: string, postId: string): Promise<boolean> {
        const instance = await this.likesRepository.addPostLike(userId, postId)
        if (instance) return true
        return false
    }

    async _addPostDislike(userId: string, postId: string): Promise<boolean> {
        await this._removePostLike(userId, postId)
        const instance = await this.likesRepository.addPostDislike(userId, postId)
        if (instance) return true
        return false
    }
}


export { LikesService }


enum LikeActionEnum {
    None = "None",
    Like = "Like",
    Dislike = "Dislike"
}