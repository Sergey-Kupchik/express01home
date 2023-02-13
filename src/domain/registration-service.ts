import EmailManager from "../managers/email-manager";
import { UsersService} from "../services/users-service";
import compareDesc from 'date-fns/compareDesc';
import add from "date-fns/add";
import jsonwebtoken from "jsonwebtoken";
import {accessTokenSecret} from "../services/tokens-service";

const recoverCodeLifeTime = "200000s";

class RegistrationService {
    constructor(protected usersService: UsersService,
                protected emailManager: EmailManager) {
    }

    async registrationNewUser(login: string, email: string, password: string): Promise<boolean> {
        await this.usersService.createUser(login, email, password)
        const user = await this.usersService.findUserByLogin(login)
        if (!user) return false
        try {
            await this.emailManager.sentConfirmationEmail(email, user.emailConfirmation.confirmationCode)
            return true
        } catch {
            await this.usersService.deleteUserById(user.accountData.id)
            return false
        }
    }

    async confirmUser(code: string): Promise<boolean> {
        const user = await this.usersService.findUserByConfirmationCode(code)
        if (!user) return false
        if (compareDesc(new Date(), user.emailConfirmation.expirationDate) !== 1) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.isConfirmed) return false
        const idConfirmed: boolean = await this.usersService.confirmUser(user.accountData.id)
        return idConfirmed
    }

    async resentConfirmationEmail(email: string,) {
        const user = await this.usersService.findUserByEmail(email)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        try {
            const confirmationCode = await this.usersService.updateConfirmationCode(user.accountData.id)
            if (!confirmationCode) return false
            await this.emailManager.sentConfirmationEmail(email, confirmationCode)
            return true
        } catch {
            await this.usersService.deleteUserById(user.accountData.id)
            return false
        }
    }

    async sentPasswordRecovery(email: string): Promise<boolean> {
        const resetPasswordExpires = add(new Date, {hours: 5,});
        const recoverCode = jsonwebtoken.sign({email}, accessTokenSecret, {
            expiresIn: recoverCodeLifeTime,
        });
        console.log(`recoverCode from sentPasswordRecovery: ${recoverCode}`)
        console.log(`resetPasswordExpires from sentPasswordRecovery: ${resetPasswordExpires}`)
        try {
            await this.emailManager.sentPasswordRecoveryEmail(email, recoverCode)
            await this.usersService.addResetPasswordByEmail(email, recoverCode)
            return true
        } catch {
            return false
        }
    }
}


export default RegistrationService