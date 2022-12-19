import emailManager from "../managers/email-manager";


const registrationService = {
    async registrationNewUser (login: string, email: string, password: string) {
        // add user to db
       await emailManager.sentConfirmationEmail(email, "123")
        // if conf email was sent return Ok resp
        // if not delet user from db
    },
    async confirmationUser () {

    },
    async resentConfirmationEmail () {

    }
};

export default registrationService