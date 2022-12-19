import emailAdapter from "../adapters/email-adapter";

const emailManager = {
    async sentConfirmationEmail(email: string,confirmationCode: string) {
        const html = "<h1>Thank for your registration</h1>" +
            "<p>To finish registration please follow the link below:" +
            `<a href=https://somesite.com/confirm-email?code=${confirmationCode}>complete registration</a>` +
            "</p>";
        const subject = "Confirm your email address from emailManager✔";
        const textMessage = "Confirm your email address from emailManager"
        try {
            const result = await emailAdapter.sentEmail(email, subject, textMessage, html)
            return result
        } catch {
            return null
        }
    }

};

export default emailManager;
