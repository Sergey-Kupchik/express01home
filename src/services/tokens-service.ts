import jsonwebtoken, {JwtPayload} from "jsonwebtoken";

interface TokenInterface extends JwtPayload {
    userId: string;
    };



const tokensService = {

    async createToken(userId: string,secretWord: string, lifeTime: string): Promise<string> {
        return jsonwebtoken.sign({userId}, secretWord, {
            expiresIn: lifeTime,
        });
    },
    async verifyToken(token: string,secretWord: string,): Promise<string|null> {
        try {
            const {userId} = <TokenInterface>jsonwebtoken.verify(token, secretWord)
            return userId
        } catch (e) {
            return null
        }
    },
}


export {tokensService}