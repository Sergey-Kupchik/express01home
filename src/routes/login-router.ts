import {Request, Response, Router} from 'express';
import {usersService} from "../services/users-service";

const loginRouter = Router();

loginRouter.post('/',
    async (req: Request, res: Response) => {
        const result: boolean = await usersService.checkCredentials(req.body.login, req.body.password)
        if (!result){
            return res.sendStatus(400)
        }
        return res.sendStatus(204)
    });


export {
    loginRouter
}