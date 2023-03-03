import {Router} from 'express';
import { myContainer } from '../inversify.config';
import {authRefreshToken} from "../middlewares/isAuth-middleware";
import { SecurityController } from './controllers/security-controller';

const securityController = myContainer.get<SecurityController>(SecurityController);

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