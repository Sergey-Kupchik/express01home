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
        const userId: string | null = await tokensService.verifyToken(jwtToken, accessTokenSecret);
        if (userId) {
            const user = await usersRepository.findUserById(userId)
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

const authRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const tets = req.cookies
    if (req.cookies?.jwt) {
        const refreshToken = req.cookies.jwt;
        const userId = await tokensService.verifyToken(refreshToken, refreshTokenSecret);
        if (userId) {
            const user = await usersRepository.findUserById(userId)
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
};


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


export {isAuthT, authJwt, authZ, authRefreshToken};