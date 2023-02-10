import {RefreshTokenInfo} from "../server/db/conn";

class RefreshTokensRepo {
    async addRefreshTokenInfo(userId: string, RefreshTokenPayload: RefreshTokenPayloadType,): Promise<boolean> {
        let result = false;
        const isUserExist = await this.getAllTokensByUserId(userId)
        if (isUserExist) {
            const addToken = await RefreshTokenInfo.findOneAndUpdate({"userId": userId}, {$push: {"refreshTokensInfo": RefreshTokenPayload}}, {new: true});
            result = true
        } else {
            const newItem = new RefreshTokenInfo({
                userId,
                refreshTokensInfo: [RefreshTokenPayload]
            });
            const savedDoc = await newItem.save();
            result = savedDoc.id === userId;
        }
        return result;
    }

    async getAllTokensByUserId(userId: string,): Promise<RefreshTokenPayloadType[] | null> {
        const user = await RefreshTokenInfo.findOne({"userId": userId}, '-_id  -__v').lean()
        if (user) return user.refreshTokensInfo
        return null;
    }

    async findRefreshTokenInfoByUserIdAndDeviceId(userId: string, deviceId: string,): Promise<RefreshTokenPayloadType | undefined> {
        const result = await RefreshTokenInfo.findOne({
            "userId": userId,
            refreshTokensInfo: {$elemMatch: {"deviceId": deviceId}}
        }, '-_id  -__v').lean()
        const tokenInfo = result?.refreshTokensInfo.find(t => t.deviceId === deviceId)
        return tokenInfo
    }

    async findRefreshTokenInfoByDeviceId(deviceId: string,): Promise<RefreshTokensInfo | null> {
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
    }

    async updateRefreshTokenDateInfo(userId: string, deviceId: string, lastActiveDate: string, clientIp: string): Promise<boolean> {
        let result = false
        const isRefreshTokenExist = await this.findRefreshTokenInfoByUserIdAndDeviceId(userId, deviceId)
        if (isRefreshTokenExist) {
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
        }
        return result;
    }

    async deleteAllTokensExceptCurrent(userId: string, deviceId: string,): Promise<boolean> {
        const result = await RefreshTokenInfo.findOneAndUpdate({userId,}, {'$pull': {'refreshTokensInfo': {'deviceId': {'$nin': [deviceId]}}}})
        return true;
    }

    async deleteTokenByDevicesId(userId: string, deviceId: string,): Promise<boolean> {
        const result = await RefreshTokenInfo.findOneAndUpdate({userId,}, {'$pull': {'refreshTokensInfo': {'deviceId': {'$in': [deviceId]}}}})
        return true;
    }

    async deleteAllTokens(): Promise<boolean> {
        const resultDoc = await RefreshTokenInfo.deleteMany()
        return resultDoc.acknowledged;
    }

    async deleteAllTokensByUserId(userId: string): Promise<boolean> {
        const tokensInstance = await RefreshTokenInfo.findOne({userId})
        if (!tokensInstance) return false
        tokensInstance.refreshTokensInfo = [];
        await tokensInstance.save();
        return true
    }
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
     RefreshTokensInfo, RefreshTokensRepo
}



