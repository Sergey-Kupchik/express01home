import {Request, Response, Router} from 'express';
import {authJwt, authZ, isAuthT} from "../middlewares/isAuth-middleware";
import {commentsQueryRepository} from "../repositories/queries/comments-query-repository";
import {CommentOutputType, commentsService} from "../services/coments-service";
import {inputValidationMiddleware} from "../middlewares/validation-middleware";
import {postsService} from "../services/posts-service";
import {
    blogIdValidation, contentCommentsValidation,
    contentValidation,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/posts-validation-middleware";
import {postsRouter} from "./posts-router";

const commentsRouter = Router();

commentsRouter.delete('/:id',
    authJwt,
    authZ,
    async (req: Request, res: Response) => {
        const isDeleted: boolean = await commentsQueryRepository.deleteCommentById(req.params.id,)
        if (!isDeleted) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
        return
    });

commentsRouter.get('/:id',
    async (req: Request, res: Response) => {
        const сomment: CommentOutputType | null = await commentsQueryRepository.getCommentById(req.params.id)
        if (!сomment){
            return res.sendStatus(401)
        }
        return res.status(200).send({id:сomment.id,
            content:сomment.content,
            userId:сomment.userId,
            userLogin:сomment.userLogin,
            createdAt:сomment.createdAt,
        })
    });
commentsRouter.put('/:id',
    authJwt,
    authZ,
    contentCommentsValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const isUpdated: boolean = await commentsService.updateCommentById(req.params.id,  req.body.content,)
        if (isUpdated) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(404)
        return
    });

export {
    commentsRouter
}