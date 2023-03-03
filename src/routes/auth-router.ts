import { Router } from 'express';
import { myContainer } from '../inversify.config';
import { authJwt, authRefreshToken, clientIp, deviceTitle } from "../middlewares/isAuth-middleware";
import {
    confirmationCodeValidation,
    emailRequired,
    emailSimpleValidator,
    emailValidator,
    loginOrEmailRequired,
    loginValidation,
    passwordValidation,
    passwordValidator,
    recoveryCodeValidator
} from "../middlewares/user-middleware";
import { inputValidationMiddleware } from "../middlewares/validation-middleware";
import { AuthController } from './controllers/auth-controller';

const authController = myContainer.get<AuthController>(AuthController);

const authRouter = Router();

authRouter.post('/login',
    passwordValidation,
    loginOrEmailRequired,
    clientIp,
    deviceTitle,
    inputValidationMiddleware,
    authController.checkUserCredentials.bind(authController)
);

authRouter.post('/logout',
    authRefreshToken,
    clientIp,
    authController.deleteTokenByDevicesId.bind(authController)
);

authRouter.post('/refresh-token',
    authRefreshToken,
    clientIp,
    authController.refreshTokens.bind(authController)
);

authRouter.get('/me',
    authJwt,
    authController.findUserById.bind(authController)
);

authRouter.post('/password-recovery',
    emailSimpleValidator,
    inputValidationMiddleware,
    authController.sentPasswordRecovery.bind(authController));

authRouter.post('/new-password',
    passwordValidator,
    recoveryCodeValidator,
    inputValidationMiddleware,
    authController.createNewPassword.bind(authController)
);


authRouter.post('/registration',
    loginValidation,
    emailValidator,
    passwordValidation,
    inputValidationMiddleware,
    authController.registrationNewUser.bind(authController)
);

authRouter.post('/registration-confirmation',
    confirmationCodeValidation,
    inputValidationMiddleware,
    authController.confirmUser.bind(authController)
);

authRouter.post('/registration-email-resending',
    emailRequired,
    inputValidationMiddleware,
    authController.resentConfirmationEmail.bind(authController)
);

export {
    authRouter
};

