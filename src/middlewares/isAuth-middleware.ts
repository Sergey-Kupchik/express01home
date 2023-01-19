import {NextFunction, Request, Response} from "express";
import {tokensService} from "../services/tokens-service";
import {accessTokenSecret, refreshTokenSecret, usersService} from "../services/users-service";
import {CommentOutputType} from "../services/coments-service";
import {commentsQueryRepository} from "../repositories/queries/comments-query-repository";
import {usersRepository} from "../repositories/users-db-repository";


const isAuthT = (req: Request, res: Response, next: NextFunction) => {
    const basicToken = req.headers["authorization"]
    if (basicToken === "Basic YWRtaW46cXdlcnR5") {
        next()
    } else {
        res.send(401)
    }
};

const authJwt = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers && !req.headers["authorization"]) {
        res.send(401)
    }
    const jwtToken = req.headers["authorization"]?.split(" ")[1]
    if (jwtToken) {
        const tokenPayload = await tokensService.verifyToken(jwtToken, accessTokenSecret);
        if (tokenPayload?.userId) {
            const user = await usersRepository.findUserById(tokenPayload.userId)
            if (user) {
                req.user = user;
                next()
                return
            } else {
                return res.send(404)
            }
        } else {
            return res.send(401)
        }
    } else {
        return res.send(401)
    }
};


const clientIp = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const clientIp = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || req.socket.remoteAddress
    req.clientIp = clientIp;
    next()
    return
}

const deviceTitle = async (req: Request, res: Response, next: NextFunction) => {
    const deviceTitle = req.headers['user-agent'] || ""
    req.deviceTitle = deviceTitle;
    next()
    return
}

const authRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
        if (req.cookies?.refreshToken) {
            const refreshToken = req.cookies.refreshToken;
            const tokenPayload = await tokensService.verifyToken(refreshToken, refreshTokenSecret);
            if (tokenPayload) {
                const tokens = await tokensService.getAllTokensByUserId(tokenPayload.userId);
                const tokenData = tokens?.find((t) => t.deviceId === tokenPayload.deviceId)
                if (tokenData) {
                    req.deviceId = tokenData.deviceId;
                } else {
                    return res.send(401)
                }
                const user = await usersRepository.findUserById(tokenPayload.userId)
                if (user) {
                    if (!user.accountData.invalidRefreshTokens.includes(refreshToken)) {
                        req.user = user;
                        next()
                        return
                    }
                }
            }
        }
        return res.sendStatus(401);
    }
;


const authZ = async (req: Request, res: Response, next: NextFunction) => {
    const сomment: CommentOutputType | null = await commentsQueryRepository.getCommentById(req.params.id)
    if (сomment) {
        if (req.user!.accountData.id === сomment.userId) {
            next()
        } else {
            return res.send(403)
        }
    } else {
        return res.send(404)
    }
};


export {isAuthT, authJwt, authZ, authRefreshToken, clientIp, deviceTitle};