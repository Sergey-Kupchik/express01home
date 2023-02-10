import {Request, Response, Router} from 'express';
import {authRefreshToken} from "../middlewares/isAuth-middleware";
import {TokensService} from "../services/tokens-service";


const securityRouter = Router();

class SecurityRouter {
    private tokensService: TokensService;

    constructor() {
        this.tokensService = new TokensService()
    }

    async getAllTokensByUserId(req: Request, res: Response) {
        const tokensInfo = await this.tokensService.getAllTokensByUserId(req.user!.accountData.id)
        res.status(200).send(tokensInfo)
        return
    }

    async deleteAllTokensExceptCurrent(req: Request, res: Response) {
        const isDeleted: boolean = await this.tokensService.deleteAllTokensExceptCurrent(req.user!.accountData.id, req.deviceId)
        if (!isDeleted) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
        return
    }

    async deleteTokenByDevicesId(req: Request, res: Response) {
        if (req.params.devicesId !== req.deviceId) {
            const tokenInfo = await this.tokensService.findRefreshTokenInfoByDeviceId(req.params.devicesId)
            if (tokenInfo === null) {
                res.sendStatus(404)
                return
            } else if (tokenInfo.userId !== req.user!.accountData.id) {
                res.sendStatus(403)
                return
            } else {
                const isDeleted: boolean = await this.tokensService.deleteTokenByDevicesId(req.user!.accountData.id, req.params.devicesId)
                if (!isDeleted) {
                    res.sendStatus(404)
                    return
                }
                res.sendStatus(204)
                return
            }
        } else {
            const isDeleted: boolean = await this.tokensService.deleteTokenByDevicesId(req.user!.accountData.id, req.deviceId)
            if (!isDeleted) {
                res.sendStatus(404)
                return
            }
            res.sendStatus(204)
            return
        }
    }
}

const security = new SecurityRouter()

securityRouter.get('/devices',
    authRefreshToken,
    security.getAllTokensByUserId.bind(security));


securityRouter.delete('/devices',
    authRefreshToken,
    security.deleteAllTokensExceptCurrent.bind(security)
);

securityRouter.delete('/devices/:devicesId',
    authRefreshToken,
    security.deleteTokenByDevicesId.bind(security)
);
export {securityRouter};