import emailManager from "../managers/email-manager";
import {usersService} from "../services/users-service";
import compareDesc from 'date-fns/compareDesc';


const registrationService = {
    async registrationNewUser(login: string, email: string, password: string): Promise<boolean> {
        await usersService.createUser(login,email, password)
        const user = await usersService.findUserByLogin(login)
        if (!user) return false
        try {
            await emailManager.sentConfirmationEmail(email, user.emailConfirmation.confirmationCode)
            return true
        } catch {
            await usersService.deleteUserById(user.accountData.id)
            return false
        }
    },
    async confirmUser(code: string): Promise<boolean> {
        const user = await usersService.findUserByConfirmationCode(code)
        if (!user) return false
        if (compareDesc(new Date(), user.emailConfirmation.expirationDate) !== 1) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.isConfirmed) return false
        const idConfirmed: boolean = await usersService.confirmUser(user.accountData.id)
        return idConfirmed
    },
    async resentConfirmationEmail(email: string,) {
        const user = await usersService.findUserByEmail(email)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        try {
            const confirmationCode = await usersService.updateConfirmationCode(user.accountData.id)
            if (!confirmationCode) return false
            await emailManager.sentConfirmationEmail(email, confirmationCode)
            return true
        } catch {
            await usersService.deleteUserById(user.accountData.id)
            return false
        }
    }
};

export default registrationService