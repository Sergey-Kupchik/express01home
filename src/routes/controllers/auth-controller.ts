import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import RegistrationService from "../../domain/registration-service";
import { UserType } from "../../repositories/users-db-repository";
import { TokensService } from "../../services/tokens-service";
import { UsersService } from "../../services/users-service";

@injectable()
export class AuthController {

    constructor(@inject(TokensService) protected tokensService: TokensService,
        @inject(UsersService) protected usersService: UsersService,
        @inject(RegistrationService) protected registrationService: RegistrationService) {

    }

    async checkUserCredentials(req: Request, res: Response) {
        const tokens = await this.usersService.checkCredentials(req.body.loginOrEmail, req.body.password, req.clientIp, req.deviceTitle)
        if (!tokens) {
            return res.sendStatus(401)
        }
        console.log(`refreshToken ${tokens.refreshToken}`)
        res.cookie('refreshToken', tokens.refreshToken, {
            // httpOnly: true,
            // secure: true,
        });
        return res.status(200).send({ "accessToken": tokens.accessToken })
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
            secure: true
        });
        return res.status(200).send({ "accessToken": tokens.accessToken })
    }

    async findUserById(req: Request, res: Response) {
        const user: UserType | null = await this.usersService.findUserById(req.user?.accountData.id!)
        if (!user) {
            return res.sendStatus(401)
        }
        return res.status(200).send({ email: user.email, login: user.login, userId: user.id, })
    }

    async sentPasswordRecovery(req: Request, res: Response) {
        await this.registrationService.sentPasswordRecovery(req.body.email)
        return res.sendStatus(204)
    }

    async createNewPassword(req: Request, res: Response) {
        const hasBeenCreate: boolean = await this.usersService.createNewPassword(req.body.newPassword, req.body.recoveryCode,)
        if (hasBeenCreate) return res.sendStatus(204)
        return res.status(400).send({ errorsMessages: [{ message: "incorrect recoveryCode", field: "recoveryCode" }] })
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