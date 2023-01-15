import jsonwebtoken, {JwtPayload} from "jsonwebtoken";
import {refreshTokensRepo} from "../repositories/refresh-token-repository";
import {currentDate} from "../utils/utils";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";

interface TokenInterface extends JwtPayload {
    userId: string;
};


const tokensService = {
    async createAccessToken(userId: string, secretWord: string, lifeTime: string,): Promise<string> {
        return jsonwebtoken.sign({userId}, secretWord, {
            expiresIn: lifeTime,
        });
    },
    async createRefreshToken(userId: string, secretWord: string, lifeTime: string, clientIp: string,): Promise<string> {
        const deviceInfo: RefreshTokenDeviceInfoType = {
            deviceId: uuidv4(),
            lastActiveDate: currentDate(),
            ip: clientIp,
            title: " title string",
            expiresIn: add(new Date, {
                seconds: 20,
            }),
        }
        const tokenPayload: RefreshTokenPayloadInfoType = {
            userId,
            ...deviceInfo
        }
        await refreshTokensRepo.addRefreshTokenInfo(userId, deviceInfo)
        return jsonwebtoken.sign({tokenPayload}, secretWord, {
            expiresIn: lifeTime,
        });
    },
    async verifyToken(token: string, secretWord: string,): Promise<string | null> {
        try {
            const {userId} = <TokenInterface>jsonwebtoken.verify(token, secretWord)
            return userId
        } catch (e) {
            return null
        }
    },
    async getAllTokensByUserId(id: string): Promise<RefreshTokenPayloadOutputType[] | null> {
        const tokensInfo = await refreshTokensRepo.getAllTokensByUserId(id)
        if (tokensInfo) return tokensInfo.map((t) => ({
            deviceId: t.deviceId,
            lastActiveDate: t.lastActiveDate,
            ip: t.ip,
            title: t.title,
        }))
        return null
    }
}
type RefreshTokenDeviceInfoType = {
    deviceId: string,
    lastActiveDate: string,
    ip: string,
    title: string,
    expiresIn: Date,

}
type RefreshTokenPayloadOutputType = Omit<RefreshTokenDeviceInfoType, "expiresIn">;

type RefreshTokenPayloadInfoType = RefreshTokenDeviceInfoType & { userId: string }

export {tokensService}