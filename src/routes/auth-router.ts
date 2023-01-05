import {Request, Response, Router} from 'express';
import {usersService} from "../services/users-service";
import {authJwt, authRefreshToken} from "../middlewares/isAuth-middleware";
import {UserType} from "../repositories/users-db-repository";
import registrationService from "../domain/registration-service";
import {
    confirmationCodeValidation,
    emailRequired, emailValidation, loginOrEmailRequired,
    loginRequired, loginValidation,
    passwordValidation
} from "../middlewares/user-middleware";
import {inputValidationMiddleware} from "../middlewares/validation-middleware";
import add from 'date-fns/add';

const authRouter = Router();

authRouter.post('/login',
    passwordValidation,
    loginOrEmailRequired,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const tokens = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (!tokens) {
            return res.sendStatus(401)
        }
        console.log(`refreshToken: ${tokens.refreshToken}`)
        res.cookie('jwt', tokens.refreshToken, {
            expires: add(new Date, {seconds: 20,}),
            httpOnly: true,
            secure: true,
            });
        return res.status(200).send({"accessToken": tokens.accessToken})
    });

authRouter.post('/logout',
    authRefreshToken,
    async (req: Request, res: Response) => {
        const hasBeenRevoked = await usersService.revokeRefreshToken(req.user!.accountData.id, req.cookies.jwt)
        if (!hasBeenRevoked) {
            return res.sendStatus(401)
        }
        return res.sendStatus(204)
    });

authRouter.post('/refresh-token',
    authRefreshToken,
    async (req: Request, res: Response) => {
        const tokens = await usersService.refreshTokens(req.user!.accountData.id, req.cookies.jwt)
        if (!tokens) {
            return res.sendStatus(401)
        }
        console.log(`refreshToken: ${tokens.refreshToken}`)
        res.cookie('jwt', tokens.refreshToken, {
            expires: add(new Date, {seconds: 20,}),
            httpOnly: true,
            secure: true,
        });
        return res.status(200).send({"accessToken": tokens.accessToken})
    });

authRouter.get('/me',
    authJwt,
    async (req: Request, res: Response) => {
        const user: UserType | null = await usersService.findUserById(req.user?.accountData.id!)
        if (!user) {
            return res.sendStatus(401)
        }
        return res.status(200).send({email: user.email, login: user.login, userId: user.id,})
    });


authRouter.post('/registration',
    loginValidation,
    emailValidation,
    passwordValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const isEmailSent: boolean = await registrationService.registrationNewUser(req.body.login, req.body.email, req.body.password)
        if (isEmailSent) return res.sendStatus( 204)
        return res.sendStatus(400)
    });

authRouter.post('/registration-confirmation',
    confirmationCodeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const isEmailSent: boolean = await registrationService.confirmUser(req.body.code,)
        if (isEmailSent) return res.sendStatus( 204)
        return res.status(400).json({
            errorsMessages: [{
                message: "Fail to confirm user",
                field: "code"
            }]
        });
    });

authRouter.post('/registration-email-resending',
    emailRequired,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const isEmailSent: boolean = await registrationService.resentConfirmationEmail(req.body.email,)
        if (isEmailSent) return res.sendStatus( 204)
        return res.status(400).json({
            errorsMessages: [{
                message: "Fail to confirm user",
                field: "email"
            }]
        });
    });

export {
    authRouter
}