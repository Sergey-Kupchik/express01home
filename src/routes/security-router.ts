import {Router} from 'express';
import {authRefreshToken} from "../middlewares/isAuth-middleware";
import {securityController} from "../composition-root";


const securityRouter = Router();

securityRouter.get('/devices',
    authRefreshToken,
    securityController.getAllTokensByUserId.bind(securityController));


securityRouter.delete('/devices',
    authRefreshToken,
    securityController.deleteAllTokensExceptCurrent.bind(securityController)
);

securityRouter.delete('/devices/:devicesId',
    authRefreshToken,
    securityController.deleteTokenByDevicesId.bind(securityController)
);
export {securityRouter};