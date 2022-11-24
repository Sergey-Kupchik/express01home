import jsonwebtoken, {JwtPayload} from "jsonwebtoken";

interface TokenInterface extends JwtPayload {
    userId: string;
    };


const tokensService = {
    async createToken(userId: string,): Promise<string> {
        return jsonwebtoken.sign({userId}, process.env.TOKEN_KEY!, {
            expiresIn: "24h",
        });
    },
    async verifyToken(token: string,): Promise<string|null> {
        try {
            const {userId} = <TokenInterface>jsonwebtoken.verify(token, process.env.TOKEN_KEY!)
            return userId
        } catch (e) {
            return null
        }
    },
}


export {tokensService}