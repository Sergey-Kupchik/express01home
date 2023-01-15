import {Request, Response, Router} from 'express';
import {PostsOutputType, postsQueryRepository} from "../repositories/queries/posts-query-repository";
import {authJwt} from "../middlewares/isAuth-middleware";
import {tokensService} from "../services/tokens-service";


const securityRouter = Router();

securityRouter.get('/devices',
    authJwt,
    async (req: Request, res: Response) => {
        const tokensInfo = await tokensService.getAllTokensByUserId(req.user!.accountData.id)
        res.send(tokensInfo)
        return
    });

export {securityRouter};