import {dbCollections, RefreshTokenInfo, User} from "../server/db/conn";


const refreshTokensRepo = {
    async addRefreshTokenInfo(userId: string, RefreshTokenPayload: RefreshTokenPayloadType,): Promise<boolean> {
        let result = false
        const isUserExist = await this.getAllTokensByUserId(userId)
        if (isUserExist) {
            const addToken = await RefreshTokenInfo.findOneAndUpdate({"userId": userId}, {$push: {"refreshTokensInfo": RefreshTokenPayload}}, {new: true});
            result = true
            // const addToken = await dbCollections.refreshTokens.updateOne({userId}, {$push: {"refreshTokensInfo": RefreshTokenPayload}});
            // if (addToken.modifiedCount === 1) {
            //     result = true
            // }
        } else {
            const newItem = new RefreshTokenInfo({
                userId,
                refreshTokensInfo: [RefreshTokenPayload]
            });
            const savedDoc = await newItem.save();
            // const newItem = await dbCollections.refreshTokens.insertOne({
            //     userId,
            //     refreshTokensInfo: [RefreshTokenPayload]
            // })
            result = savedDoc.id === userId;
        }
        return result;
    },
    async getAllTokensByUserId(userId: string,): Promise<RefreshTokenPayloadType[] | null> {
        // const user = await dbCollections.refreshTokens.findOne({userId}, {projection: {_id: 0}})
        const user = await RefreshTokenInfo.findOne({"userId": userId}, '-_id  -__v').lean()
        if (user) return user.refreshTokensInfo
        return null;
    },
    async findRefreshTokenInfoByUserIdAndDeviceId(userId: string, deviceId: string,): Promise<RefreshTokenPayloadType | undefined> {
        // const result = await dbCollections.refreshTokens.findOne({
        //     "userId": userId,
        //     refreshTokensInfo: {$elemMatch: {"deviceId": deviceId}}
        // }, {projection: {_id: 0, userId: 0}})
        const result = await RefreshTokenInfo.findOne({
            "userId": userId,
            refreshTokensInfo: {$elemMatch: {"deviceId": deviceId}}
        }, '-_id  -__v').lean()
        const tokenInfo = result?.refreshTokensInfo.find(t => t.deviceId === deviceId)
        return tokenInfo

    },
    async findRefreshTokenInfoByDeviceId(deviceId: string,): Promise<RefreshTokensInfo | null> {
        // const tokens = await dbCollections.refreshTokens.findOne({
        //     refreshTokensInfo: {$elemMatch: {"deviceId": deviceId}}
        // }, {projection: {_id: 0,}})
        const tokens = await RefreshTokenInfo.findOne({
            refreshTokensInfo: {$elemMatch: {"deviceId": deviceId}}
        }, '-_id  -__v').lean()
        if (tokens) {
            return {
                userId: tokens.userId,
                refreshTokenInfo: tokens.refreshTokensInfo.find(t => t.deviceId === deviceId)
            }
        }
        return null

    },

    async updateRefreshTokenDateInfo(userId: string, deviceId: string, lastActiveDate: string, clientIp: string): Promise<boolean> {
        let result = false
        const isRefreshTokenExist = await this.findRefreshTokenInfoByUserIdAndDeviceId(userId, deviceId)
        if (isRefreshTokenExist) {
            // const updateToken = await dbCollections.refreshTokens.updateOne(
            //     {
            //         "userId": userId,
            //         refreshTokensInfo: {$elemMatch: {"deviceId": deviceId}}
            //     },
            //     {
            //         $set: {
            //             "refreshTokensInfo.$.lastActiveDate": lastActiveDate,
            //             "refreshTokensInfo.$.ip": clientIp,
            //         },
            //     }
            // )

            const updateToken = await RefreshTokenInfo.findOneAndUpdate({
                "userId": userId,
                refreshTokensInfo: {$elemMatch: {"deviceId": deviceId}}
            }, {
                $set: {
                    "refreshTokensInfo.$.lastActiveDate": lastActiveDate,
                    "refreshTokensInfo.$.ip": clientIp,
                },
            }, {new: true});
            result = true
            // if (updateToken.modifiedCount === 1) {
            //     result = true
            // }
        }
        return result;
    },
    async deleteAllTokensExceptCurrent(userId: string, deviceId: string,): Promise<boolean> {
        const result = await RefreshTokenInfo.findOneAndUpdate({userId,}, {'$pull': {'refreshTokensInfo': {'deviceId': {'$nin': [deviceId]}}}})
        // const result = await dbCollections.refreshTokens.updateMany({userId,}, {'$pull': {'refreshTokensInfo': {'deviceId': {'$nin': [deviceId]}}}})
        // return result.acknowledged;
        return true;
    },
    async deleteTokenByDevicesId(userId: string, deviceId: string,): Promise<boolean> {
        const result = await RefreshTokenInfo.findOneAndUpdate({userId,}, {'$pull': {'refreshTokensInfo': {'deviceId': {'$in': [deviceId]}}}})
        return true;
        // const result = await dbCollections.refreshTokens.updateMany({userId,}, {'$pull': {'refreshTokensInfo': {'deviceId': {'$in': [deviceId]}}}})
        // return result.acknowledged;
    },
    async deleteAllTokens(): Promise<boolean> {
        // const result = await dbCollections.refreshTokens.deleteMany({})
        // return result.deletedCount >= 0
        const resultDoc = await RefreshTokenInfo.deleteMany()
        return resultDoc.acknowledged;
    },


}


type RefreshTokenPayloadType = {
    deviceId: string,
    lastActiveDate: string,
    ip: string,
    title: string,
    expiresIn: string,
}

type RefreshTokensInfo = {
    userId: string,
    refreshTokenInfo: RefreshTokenPayloadType | undefined
}
export {
    refreshTokensRepo, RefreshTokensInfo
}



