import { NextFunction, Request, Response } from "express";
import { myContainer } from "../inversify.config";
import { CommentsQueryRepo } from "../repositories/queries/comments-query-repository";
import { UsersRepo } from "../repositories/users-db-repository";
import { accessTokenSecret, refreshTokenSecret, TokensService } from "../services/tokens-service";
import {PostsQueryRepo} from "../repositories/queries/posts-query-repository";

const commentsQueryRepository = myContainer.get<CommentsQueryRepo>(CommentsQueryRepo);
const tokensService = myContainer.get<TokensService>(TokensService);
const usersRepository = myContainer.get<UsersRepo>(UsersRepo);


const isAuthT = (req: Request, res: Response, next: NextFunction) => {
    const basicToken = req.headers["authorization"]
    if (basicToken === "Basic YWRtaW46cXdlcnR5") {
        next()
    } else {
        res.sendStatus(401)
    }
};

const authJwt = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers && !req.headers["authorization"]) {
        res.sendStatus(401)
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
                return res.sendStatus(404)
            }
        } else {
            return res.sendStatus(401)
        }
    } else {
        return res.sendStatus(401)
    }
};

const authJwtNoError = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers && !req.headers["authorization"]) {
        next()
        return
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
                next()
                return
            }
        } else {
            next()
            return
        }
    } else {
        next()
        return
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
                const tokenData = tokens?.find((t) => t.deviceId === tokenPayload.deviceId && t.lastActiveDate === tokenPayload.lastActiveDate)
                if (tokenData) {
                    req.deviceId = tokenData.deviceId;
                }
                // else {
                //     return res.send(401)
                // }
                const user = await usersRepository.findUserById(tokenPayload.userId)
                if (user) {
                    if (!user.accountData.invalidRefreshTokens.includes(refreshToken)) {
                        req.user = user;
                        next()
                        return
                    }
                } else {
                    return res.sendStatus(401)
                }
            }
        }
        return res.sendStatus(401);
    }
;

const devicesId = async (req: Request, res: Response, next: NextFunction) => {
        if (req.cookies?.refreshToken) {
            const refreshToken = req.cookies.refreshToken;
            const tokenPayload = await tokensService.verifyToken(refreshToken, refreshTokenSecret);
            if (tokenPayload) {
                const tokens = await tokensService.getAllTokensByUserId(tokenPayload.userId);
                const tokenData = tokens?.find((t) => t.deviceId === req.params.devicesId && t.lastActiveDate === tokenPayload.lastActiveDate)
                if (tokenData) {
                    req.deviceId = req.params.devicesId;
                    next()
                    return
                } else {
                    return res.sendStatus(403)
                }
            } else {
                return res.sendStatus(401);
            }
        }
        return res.sendStatus(401);
    }
;


const authZ = async (req: Request, res: Response, next: NextFunction) => {
    const сomment = await commentsQueryRepository.getCommentById(req.params.id)
    if (сomment) {
        if (req.user!.accountData.id === сomment.userId) {
            next()
        } else {
            return res.sendStatus(403)
        }
    } else {
        return res.sendStatus(404)
    }
};

const commentIdValidation = async (req: Request, res: Response, next: NextFunction) => {
    const item = await commentsQueryRepository.getCommentById(req.params.id)
    if (item) {
        next()
        return
    }
    res.sendStatus(404)
    return
};


export { isAuthT, authJwt, authZ, authRefreshToken, clientIp, deviceTitle, devicesId, commentIdValidation, authJwtNoError };
