import EmailAdapter from "../adapters/email-adapter";

class EmailManager {

    constructor(protected emailAdapter: EmailAdapter) {
    }

    async sentConfirmationEmail(email: string, confirmationCode: string) {
        const html = "<h1>Thank for your registration</h1>" +
            "<p>To finish registration please follow the link below:" +
            `<a href=https://somesite.com/confirm-email?code=${confirmationCode}>complete registration</a>` +
            "</p>";
        const subject = "Confirm your email address from emailManager✔";
        const textMessage = "Confirm your email address from emailManager"
        try {
            const result = await this.emailAdapter.sentEmail(email, subject, textMessage, html)
            return result
        } catch {
            return null
        }
    }

    async sentPasswordRecoveryEmail(email: string, recoverCode: string) {
        const html = '<h1>Password recovery</h1>' +
            '<p>To finish password recovery please follow the link below:' +
            `<a href=https://somesite.com/password-recovery?recoveryCode=${recoverCode}>recovery password</a>` +
            '</p>';
        const subject = "Recovery password✔";
        const textMessage = "Recovery password"
        try {
            const result = await this.emailAdapter.sentEmail(email, subject, textMessage, html)
            return result
        } catch {
            return null
        }
    }
}


export default EmailManager;
