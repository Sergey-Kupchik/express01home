import {dbCollections} from "../server/db/conn";


const refreshTokensRepo = {
    async addRefreshTokenInfo(userId: string, RefreshTokenPayload: RefreshTokenPayloadType,): Promise<boolean> {
        let result = false
        const isUserExist = await this.getAllTokensByUserId(userId)
        if (isUserExist) {
            const addToken = await dbCollections.refreshTokens.updateOne({userId}, {$push: {"refreshTokensInfo": RefreshTokenPayload}});
            if (addToken.modifiedCount === 1) {
                result = true
            }
        } else {
            const newItem = await dbCollections.refreshTokens.insertOne({
                userId,
                refreshTokensInfo: [RefreshTokenPayload]
            })
            result = newItem.acknowledged;
        }
        return result;
    },
    async getAllTokensByUserId(userId: string,): Promise<RefreshTokenPayloadType[] | null> {
        const user = await dbCollections.refreshTokens.findOne({userId}, {projection: {_id: 0}})
        if (user) return user.refreshTokensInfo
        return null;
    },
    async findRefreshTokenInfoByDeviceId(userId: string, deviceId: string,): Promise<RefreshTokenPayloadType | undefined> {
        const result = await dbCollections.refreshTokens.findOne({
            "userId": userId,
            refreshTokensInfo: {$elemMatch: {"deviceId": deviceId}}
        }, {projection: {_id: 0, userId: 0}})
        const tokenInfo = result?.refreshTokensInfo.find(t => t.deviceId === deviceId)
        return tokenInfo

    },
    async updateRefreshTokenDateInfo(userId: string, deviceId: string, lastActiveDate: string, clientIp: string): Promise<boolean> {
        let result = false
        const isRefreshTokenExist = await this.findRefreshTokenInfoByDeviceId(userId, deviceId)
        if (isRefreshTokenExist) {
            const updateToken = await dbCollections.refreshTokens.updateOne(
                {
                    "userId": userId,
                    refreshTokensInfo: {$elemMatch: {"deviceId": deviceId}}
                },
                {
                    $set: {
                        "refreshTokensInfo.$.lastActiveDate": lastActiveDate,
                        "refreshTokensInfo.$.ip": clientIp,
                    },
                }
            )
            if (updateToken.modifiedCount === 1) {
                result = true
            }
        }
        return result;
    },
    async deleteAllTokensExceptCurrent(userId:string,  deviceId:string,): Promise<boolean> {
        const result  = await dbCollections.refreshTokens.updateMany({userId,},{'$pull':{'refreshTokensInfo': {'deviceId': {'$nin': [deviceId]} }}})
        return result.acknowledged;
    },
    async deleteTokensByDevicesId(userId:string,  deviceId:string,): Promise<boolean> {
        const result  = await dbCollections.refreshTokens.updateMany({userId,},{'$pull':{'refreshTokensInfo': {'deviceId': {'$in': [deviceId]} }}})
        return result.acknowledged;
    },
    async deleteAllTokens(): Promise<boolean> {
        const result = await dbCollections.refreshTokens.deleteMany({})
        return result.deletedCount >= 0
    },


}


type RefreshTokenPayloadType = {
    deviceId: string,
    lastActiveDate: string,
    ip: string,
    title: string,
    expiresIn: string,
}

export {
    refreshTokensRepo,
}



