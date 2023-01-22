import {Request, Response, Router} from 'express';
import {authJwt, authRefreshToken, devicesId, isAuthT} from "../middlewares/isAuth-middleware";
import {tokensService} from "../services/tokens-service";
import {inputValidationMiddleware} from "../middlewares/validation-middleware";
import {postsService} from "../services/posts-service";


const securityRouter = Router();

securityRouter.get('/devices',
    authRefreshToken,
    async (req: Request, res: Response) => {
        const tokensInfo = await tokensService.getAllTokensByUserId(req.user!.accountData.id)
        res.status(200).send(tokensInfo)
        return
    });


securityRouter.delete('/devices',
    authRefreshToken,
    async (req: Request, res: Response) => {
        const isDeleted: boolean = await tokensService.deleteAllTokensExceptCurrent(req.user!.accountData.id, req.deviceId)
        if (!isDeleted) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
        return
    });

securityRouter.delete('/devices/:devicesId',
    devicesId,
    authRefreshToken,
    async (req: Request, res: Response) => {
            const isDeleted: boolean = await tokensService.deleteAllTokensExceptCurrent(req.user!.accountData.id, req.deviceId)
            if (!isDeleted) {
                res.sendStatus(404)
                return
            }
            res.sendStatus(204)
            return

    });
export {securityRouter};