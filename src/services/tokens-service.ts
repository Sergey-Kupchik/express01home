import { injectable, inject } from "inversify";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import { RefreshTokensInfo, RefreshTokensRepo } from "../repositories/refresh-token-repository";
import { currentDate } from "../utils/utils";
import { v4 as uuidv4 } from "uuid";


const accessTokenSecret: string = process.env.TOKEN_KEY || "AccessTokenSecretLocal";
const refreshTokenSecret: string = process.env.REFRESH_TOKEN_KEY || "RefreshTokenSecretLocal"
const accessTokenLifeTime = "100000s"
const refreshTokenLifeTime = "200000s"

interface TokenInterface extends JwtPayload {
    userId: string;
    deviceId: string;
    lastActiveDate: string;
    email?: string;
};

@injectable()
class TokensService {
    constructor(@inject(RefreshTokensRepo) protected refreshTokensRepo: RefreshTokensRepo) {
    }
    async createAccessToken(userId: string,): Promise<string> {
        return jsonwebtoken.sign({ userId }, accessTokenSecret, {
            expiresIn: accessTokenLifeTime,
        });
    }

    async createRefreshToken(userId: string, clientIp: string, deviceTitle: string): Promise<string> {
        const userTokensInfo = await this.getAllTokensByUserId(userId)
        const tokenInfo = userTokensInfo?.find((t) => t.ip === clientIp && t.title === deviceTitle)
        if (tokenInfo) {
            return this.updateRefreshToken(userId, tokenInfo.deviceId, clientIp)
        } else {
            const tokenPayload: TokenInterface = {
                userId,
                deviceId: uuidv4(),
                lastActiveDate: currentDate()
            }
            const deviceInfo: RefTokenInfoType = {
                ip: clientIp,
                title: deviceTitle,
                expiresIn: refreshTokenLifeTime,
                deviceId: tokenPayload.deviceId,
                lastActiveDate: tokenPayload.lastActiveDate
            }
            await this.saveRefreshTokenInfo(userId, deviceInfo)
            return jsonwebtoken.sign({ ...tokenPayload }, refreshTokenSecret, {
                expiresIn: refreshTokenLifeTime,
            });
        }
    }

    async updateRefreshToken(userId: string, deviceId: string, clientIp: string): Promise<string> {
        const lastActiveDate = currentDate();
        await this.refreshTokensRepo.updateRefreshTokenDateInfo(userId, deviceId, lastActiveDate, clientIp)
        return jsonwebtoken.sign({ userId, deviceId, lastActiveDate }, refreshTokenSecret, {
            expiresIn: refreshTokenLifeTime,
        });
    }

    async saveRefreshTokenInfo(userId: string, refTokenInfo: RefTokenInfoType): Promise<boolean> {
        const result = await this.refreshTokensRepo.addRefreshTokenInfo(userId, refTokenInfo)
        return result
    }

    async verifyToken(token: string, secretWord: string,): Promise<TokenInterface | null> {
        try {
            const tokenPayload = <TokenInterface>jsonwebtoken.verify(token, secretWord)
            return tokenPayload
        } catch (e) {
            return null
        }
    }

    async getAllTokensByUserId(userId: string): Promise<RefreshTokenPayloadOutputType[] | null> {
        const tokensInfo = await this.refreshTokensRepo.getAllTokensByUserId(userId)
        if (tokensInfo) return tokensInfo.map((t) => ({
            deviceId: t.deviceId,
            lastActiveDate: t.lastActiveDate,
            ip: t.ip,
            title: t.title,
        }))
        return null
    }

    async deleteAllTokensExceptCurrent(userId: string, deviceId: string,): Promise<boolean> {
        const result = await this.refreshTokensRepo.deleteAllTokensExceptCurrent(userId, deviceId)
        return result
    }

    async deleteTokenByDevicesId(userId: string, deviceId: string,): Promise<boolean> {
        const result = await this.refreshTokensRepo.deleteTokenByDevicesId(userId, deviceId)
        return result
    }

    async deleteAllTokensByUserId(userId: string): Promise<boolean> {
        const result = await this.refreshTokensRepo.deleteAllTokensByUserId(userId)
        return result
    }

    async findRefreshTokenInfoByDeviceId(deviceId: string,): Promise<RefreshTokensInfo | null> {
        const result = await this.refreshTokensRepo.findRefreshTokenInfoByDeviceId(deviceId)
        return result
    }
}

type RefTokenInfoType = {
    deviceId: string,
    lastActiveDate: string,
    ip: string,
    title: string,
    expiresIn: string,

}

type RefreshTokenPayloadOutputType = Omit<RefTokenInfoType, "expiresIn">;
export { accessTokenSecret, refreshTokenSecret, TokensService }