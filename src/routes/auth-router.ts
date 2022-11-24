import {Request, Response, Router} from 'express';
import {usersService} from "../services/users-service";
import {authJwt} from "../middlewares/isAuth-middleware";
import {UserType} from "../repositories/users-db-repository";

const authRouter = Router();

authRouter.post('/login',
    async (req: Request, res: Response) => {
        const result: boolean = await usersService.checkCredentials(req.body.login, req.body.password)
        if (!result){
            return res.sendStatus(401)
        }
        return res.sendStatus(204)
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