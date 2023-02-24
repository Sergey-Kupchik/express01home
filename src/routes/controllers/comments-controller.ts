import {CommentsQueryRepo} from "../../repositories/queries/comments-query-repository";
import {CommentOutputType, CommentsService} from "../../services/coments-service";
import {Request, Response} from "express";
import {LikesService} from "../../services/likes-service";

export class CommentsController {

    constructor(protected commentsQueryRepository: CommentsQueryRepo,
                protected commentsService: CommentsService,
                protected likesService: LikesService,

    ) {

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
    async likeDislike(req: Request, res: Response) {
        const item = await this.commentsQueryRepository.getCommentById(req.params.id)
        if (!item) {
            res.sendStatus(404)
            return
        }
        const isUpdated: boolean = await this.likesService.likeDislike(req.params.id, req.user!.accountData.id,req.body.likeStatus,)
        if (isUpdated) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(404)
        return
    }
}

