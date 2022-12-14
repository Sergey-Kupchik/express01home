import {NextFunction, Request, Response} from "express";
import {tokensService} from "../services/tokens-service";
import {usersService} from "../services/users-service";
import {CommentOutputType} from "../services/coments-service";
import {commentsQueryRepository} from "../repositories/queries/comments-query-repository";

const isAuthT = (req: Request, res: Response, next: NextFunction) => {
    const basicToken = req.headers["authorization"]
    if (basicToken === "Basic YWRtaW46cXdlcnR5") {
        next()
    } else {
        res.send(401)
    }
};

const authJwt = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers["authorization"]) {
        res.send(401)
    }
    const jwtToken = req.headers["authorization"]?.split(" ")[1]
    if (jwtToken) {
        const userId: string | null = await tokensService.verifyToken(jwtToken);
        if (userId) {
            const user = await usersService.findUserById(userId);
            if(user){
                req.user = user;
                next()
                return
            } else {
                return res.send(404)
            }
        } else {
            return res.send(404)
        }
    } else {
        return res.send(401)
    }
};

const authZ = async (req: Request, res: Response, next: NextFunction) => {
    const сomment: CommentOutputType | null = await commentsQueryRepository.getCommentById(req.params.id)
    if (сomment){
        if (  req.user!.id===сomment.userId) {
            next()
        }
        else {
            return res.send(403)
        }
    }
    else {
        return res.send(404)
    }
};



export {isAuthT, authJwt, authZ};