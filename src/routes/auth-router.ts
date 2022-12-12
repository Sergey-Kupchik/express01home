import {Request, Response, Router} from 'express';
import {usersService} from "../services/users-service";
import {authJwt} from "../middlewares/isAuth-middleware";
import {UserType} from "../repositories/users-db-repository";
import {tokensService} from "../services/tokens-service";

const authRouter = Router();

authRouter.post('/login',
    async (req: Request, res: Response) => {
        const token: string | null = await usersService.checkCredentials(req.body.login, req.body.password)
        if (!token){
            return res.sendStatus(401)
        }
        return res.status(200).send({"accessToken": token})
    });

authRouter.get('/me',
    authJwt,
    async (req: Request, res: Response) => {
        const user: UserType | null = await usersService.findUserById( req.user?.id!)
        if (!user){
            return res.sendStatus(401)
        }
        return res.status(200).send({email:user.email,login:user.login,userId:user.id,})
    });


export {
    authRouter
}