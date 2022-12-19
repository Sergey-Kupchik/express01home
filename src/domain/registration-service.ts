import emailManager from "../managers/email-manager";
import {usersService} from "../services/users-service";


const registrationService = {
    async registrationNewUser (login: string, email: string, password: string) {
       const user = await usersService.findUserByLogin(login)
       await emailManager.sentConfirmationEmail(email, user.emailConfirmation.confirmationCode)
        // if conf email was sent return Ok resp
        // if not delet user from db
    },
    async confirmationUser () {

    },
    async resentConfirmationEmail () {

    }
};

export default registrationService