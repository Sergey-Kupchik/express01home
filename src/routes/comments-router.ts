import {Request, Response, Router} from 'express';
import {authJwt, authZ} from "../middlewares/isAuth-middleware";
import {CommentsQueryRepo} from "../repositories/queries/comments-query-repository";
import {CommentOutputType, CommentsService,} from "../services/coments-service";
import {inputValidationMiddleware} from "../middlewares/validation-middleware";
import {contentCommentsValidation} from "../middlewares/posts-validation-middleware";

const commentsRouter = Router();

class CommentsRouter {
    private commentsQueryRepository: CommentsQueryRepo;
    private commentsService: CommentsService;

    constructor() {
        this.commentsQueryRepository = new CommentsQueryRepo();
        this.commentsService = new CommentsService();
    }

    async deleteCommentById(req: Request, res: Response) {
        const isDeleted: boolean = await this.commentsQueryRepository.deleteCommentById(req.params.id,)
        if (!isDeleted) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
        return
    }

    async getCommentById(req: Request, res: Response) {
        const сomment: CommentOutputType | null = await this.commentsQueryRepository.getCommentById(req.params.id)
        if (!сomment) {
            return res.sendStatus(404)
        }
        return res.status(200).send({
            id: сomment.id,
            content: сomment.content,
            userId: сomment.userId,
            userLogin: сomment.userLogin,
            createdAt: сomment.createdAt,
        })
    }

    async updateCommentById(req: Request, res: Response) {
        const isUpdated: boolean = await this.commentsService.updateCommentById(req.params.id, req.body.content,)
        if (isUpdated) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(404)
        return
    }
}

const comments = new CommentsRouter();

commentsRouter.delete('/:id',
    authJwt,
    authZ,
    comments.deleteCommentById.bind(comments)
);


commentsRouter.get('/:id',
    comments.getCommentById.bind(comments)
);
commentsRouter.put('/:id',
    authJwt,
    authZ,
    contentCommentsValidation,
    inputValidationMiddleware,
    comments.updateCommentById.bind(comments)
);

export {
    commentsRouter
}