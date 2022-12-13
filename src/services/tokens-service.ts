import jsonwebtoken, {JwtPayload} from "jsonwebtoken";

interface TokenInterface extends JwtPayload {
    userId: string;
    };


const secret: any = process.env.TOKEN_KEY

const tokensService = {

    async createToken(userId: string,): Promise<string> {
        return jsonwebtoken.sign({userId}, secret, {
            expiresIn: "24h",
        });
    },
    async verifyToken(token: string,): Promise<string|null> {
        try {
            const {userId} = <TokenInterface>jsonwebtoken.verify(token, secret)
            return userId
        } catch (e) {
            return null
        }
    },
}


export {tokensService}