import {Request, Response, Router} from 'express';
import {UsersServ} from "../services/users-service";
import {authJwt, authRefreshToken, clientIp, deviceTitle} from "../middlewares/isAuth-middleware";
import {UserType} from "../repositories/users-db-repository";
import RegistrationService from "../domain/registration-service";
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
import {inputValidationMiddleware} from "../middlewares/validation-middleware";
import {TokensService} from "../services/tokens-service";

const authRouter = Router();

class AuthRouter {
    private tokensService: TokensService;
    private usersService: UsersServ;
    private registrationService: RegistrationService;

    constructor() {
        this.tokensService = new TokensService()
        this.usersService = new UsersServ()
        this.registrationService = new RegistrationService()
    }

    async checkUserCredentials(req: Request, res: Response) {
        const tokens = await this.usersService.checkCredentials(req.body.loginOrEmail, req.body.password, req.clientIp, req.deviceTitle)
        if (!tokens) {
            return res.sendStatus(401)
        }
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: true,
        });
        return res.status(200).send({"accessToken": tokens.accessToken})
    }

    async deleteTokenByDevicesId(req: Request, res: Response) {
        const hasBeenRevoked = await this.tokensService.deleteTokenByDevicesId(req.user!.accountData.id, req.deviceId)
        if (!hasBeenRevoked) {
            return res.sendStatus(401)
        }
        return res.sendStatus(204)
    }

    async refreshTokens(req: Request, res: Response) {
        const tokens = await this.usersService.refreshTokens(req.user!.accountData.id, req.cookies.refreshToken, req.deviceId, req.clientIp)
        if (!tokens) {
            return res.sendStatus(401)
        }
        console.log(`refreshToken: ${tokens.refreshToken}`)
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: true,
        });
        return res.status(200).send({"accessToken": tokens.accessToken})
    }

    async findUserById(req: Request, res: Response) {
        const user: UserType | null = await this.usersService.findUserById(req.user?.accountData.id!)
        if (!user) {
            return res.sendStatus(401)
        }
        return res.status(200).send({email: user.email, login: user.login, userId: user.id,})
    }

    async sentPasswordRecovery(req: Request, res: Response) {
        await this.registrationService.sentPasswordRecovery(req.body.email)
        return res.sendStatus(204)
    }

    async createNewPassword(req: Request, res: Response) {
        const hasBeenCreate: boolean = await this.usersService.createNewPassword(req.body.newPassword, req.body.recoveryCode,)
        if (hasBeenCreate) return res.sendStatus(204)
        return res.status(400).send({errorsMessages: [{message: "incorrect recoveryCode", field: "recoveryCode"}]})
    }

    async registrationNewUser(req: Request, res: Response) {
        const isEmailSent: boolean = await this.registrationService.registrationNewUser(req.body.login, req.body.email, req.body.password)
        if (isEmailSent) return res.sendStatus(204)
        return res.sendStatus(400)
    }

    async confirmUser(req: Request, res: Response) {
        const isEmailSent: boolean = await this.registrationService.confirmUser(req.body.code,)
        if (isEmailSent) return res.sendStatus(204)
        return res.status(400).json({
            errorsMessages: [{
                message: "Fail to confirm user",
                field: "code"
            }]
        });
    }

    async resentConfirmationEmail(req: Request, res: Response) {
        const isEmailSent: boolean = await this.registrationService.resentConfirmationEmail(req.body.email,)
        if (isEmailSent) return res.sendStatus(204)
        return res.status(400).json({
            errorsMessages: [{
                message: "Fail to confirm user",
                field: "email"
            }]
        });
    }
}

const auth = new AuthRouter();

authRouter.post('/login',
    passwordValidation,
    loginOrEmailRequired,
    clientIp,
    deviceTitle,
    inputValidationMiddleware,
    auth.checkUserCredentials.bind(auth)
);

authRouter.post('/logout',
    authRefreshToken,
    clientIp,
    auth.deleteTokenByDevicesId.bind(auth)
);

authRouter.post('/refresh-token',
    authRefreshToken,
    clientIp,
    auth.refreshTokens.bind(auth)
);

authRouter.get('/me',
    authJwt,
    auth.findUserById.bind(auth)
);

authRouter.post('/password-recovery',
    emailSimpleValidator,
    inputValidationMiddleware,
    auth.sentPasswordRecovery.bind(auth));

authRouter.post('/new-password',
    passwordValidator,
    recoveryCodeValidator,
    inputValidationMiddleware,
    auth.createNewPassword.bind(auth)
);


authRouter.post('/registration',
    loginValidation,
    emailValidator,
    passwordValidation,
    inputValidationMiddleware,
    auth.registrationNewUser.bind(auth)
);

authRouter.post('/registration-confirmation',
    confirmationCodeValidation,
    inputValidationMiddleware,
    auth.confirmUser.bind(auth)
);

authRouter.post('/registration-email-resending',
    emailRequired,
    inputValidationMiddleware,
    auth.resentConfirmationEmail.bind(auth)
);

export {
    authRouter
}