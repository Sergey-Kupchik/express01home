import {LikeRepo} from "../repositories/likes-db-repository";

class LikesService {

    constructor(protected likesRepository: LikeRepo) {
    }

    async createInstance(userId: string,): Promise<boolean> {
        const instance = await this.likesRepository.createInstance(userId)
        if (instance) return true
        return false
    }
    async likeDislike(userId: string, commentId: string, actionType: LikeActionEnum): Promise<boolean> {
       let hasBeenUp = false
        if (actionType === LikeActionEnum.Like){
            await this._removeDislike(userId, commentId)
            hasBeenUp = await this._addLike(userId, commentId)
        }
        if (actionType === LikeActionEnum.Dislike){
            await this._removeLike(userId, commentId)
            hasBeenUp = await this._addDislike(userId, commentId)
        }
        if (actionType === LikeActionEnum.None){
            await this._removeLike(userId, commentId)
            await this._removeDislike(userId, commentId)
            hasBeenUp = true
        }
        return hasBeenUp
    }
    async _removeLike(userId: string, commentId: string): Promise<boolean> {
        const instance = await this.likesRepository.removeLike(userId, commentId)
        if (instance) return true
        return false
    }

    async _removeDislike(userId: string, commentId: string): Promise<boolean> {
        const instance = await this.likesRepository.removeDislike(userId, commentId)
        if (instance) return true
        return false
    }

    async _addLike(userId: string, commentId: string): Promise<boolean> {
        const instance = await this.likesRepository.addLike(userId, commentId)
        if (instance) return true
        return false
    }

    async _addDislike(userId: string, commentId: string): Promise<boolean> {
        await this._removeLike(userId, commentId)
        const instance = await this.likesRepository.addDislike(userId, commentId)
        if (instance) return true
        return false
    }
}


export {LikesService}


enum LikeActionEnum {
    None = "None",
    Like = "Like",
    Dislike = "Dislike"
}