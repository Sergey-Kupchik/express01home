import nodemailer from "nodemailer";


const emailAdapter = {
    async _addTransport() {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kupchikrabota@gmail.com',
                pass: 'kexizcyltqshmpsy'
            }
        });
        return transporter
    },
    async sentConfirmationEmail(email: string,html:string) {
        const transporter = await this._addTransport()
        const info = await transporter.sendMail({
            from: '"Cool man 👻" <kupchikrabota@gmail.com>',
            to: `${email}, ${email}`,
            subject: "Confirm your email address ✔",
            text: "Confirm your email address",
            html: "<a href=\"https://www.w3schools.com\">Confirm</a> ${html}",
        });
        return info.response
    },
    async sentEmail(email: string,subject: string,textMessage:string, html:string) {
        const transporter = await this._addTransport()
        const info = await transporter.sendMail({
            from: '"Cool man 👻" <kupchikrabota@gmail.com>',
            to: `${email}, ${email}`,
            subject: subject,
            text: textMessage,
            html: html,
        });
        return info.response
    }
}


export default emailAdapter;