import {Request, Response, Router} from 'express';
import {usersService} from "../services/users-service";
import {authJwt} from "../middlewares/isAuth-middleware";
import {UserType} from "../repositories/users-db-repository";
import registrationService from "../domain/registration-service";
import {
    confirmationCodeValidation,
    emailRequired, emailValidation,
    loginRequired, loginValidation,
    passwordValidation
} from "../middlewares/user-middleware";
import {inputValidationMiddleware} from "../middlewares/validation-middleware";

const authRouter = Router();

authRouter.post('/login',
    async (req: Request, res: Response) => {
        const token: string | null = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (!token) {
            return res.sendStatus(401)
        }
        return res.status(200).send({"accessToken": token})
    });

authRouter.get('/me',
    authJwt,
    async (req: Request, res: Response) => {
        const user: UserType | null = await usersService.findUserById(req.user?.id!)
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
        return res.status(400).send({"errorsMessages": [{ "message": "Fail to confirm user", "field": 400 }]})
    });

authRouter.post('/registration-email-resending',
    emailRequired,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const isEmailSent: boolean = await registrationService.resentConfirmationEmail(req.body.email,)
        if (isEmailSent) return res.sendStatus( 204)
        return res.status(400).send({"errorsMessages": [{ "message": "Fail to resending email", "field": 400 }]})

    });

export {
    authRouter
}