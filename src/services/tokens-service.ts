import jsonwebtoken, {JwtPayload} from "jsonwebtoken";

interface TokenInterface extends JwtPayload {
    userId: string;
    };


const secret: any = process.env.TOKEN_KEY

const tokensService = {

    async createToken(userId: string,): Promise<string> {
        console.log(`secret word :${secret}`)
        return jsonwebtoken.sign({userId}, secret, {
            expiresIn: "24h",
        });
    },
    async verifyToken(token: string,): Promise<string|null> {
        console.log(`secret word :${secret}`)
        try {
            const {userId} = <TokenInterface>jsonwebtoken.verify(token, secret)
            return userId
        } catch (e) {
            return null
        }
    },
}


export {tokensService}