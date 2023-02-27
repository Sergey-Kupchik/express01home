import {CommentsQueryRepo} from "../../repositories/queries/comments-query-repository";
import {CommentOutputType, CommentsService} from "../../services/coments-service";
import {Request, Response} from "express";
import {LikesService} from "../../services/likes-service";
import {LikeQueryRepo} from "../../repositories/queries/likes-query-repository";

export class CommentsController {

    constructor(protected commentsQueryRepository: CommentsQueryRepo,
                protected commentsService: CommentsService,
                protected likesService: LikesService,
                protected likesQueryRepository: LikeQueryRepo,
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
        const сomment = await this.commentsQueryRepository.getCommentById(req.params.id)
        if (!сomment) {
            res.sendStatus(404)
            return
        }
        const likesCountInfo = await this.likesQueryRepository.getLikesCount4Comment(req.params.id)
        return res.status(200).send({
            id: сomment.id,
            content: сomment.content,
            commentatorInfo: {
                userId: сomment.userId,
                userLogin: сomment.userLogin,
            },
            createdAt: сomment.createdAt,
            likesInfo: {
                likesCount: likesCountInfo.likesCount,
                dislikesCount: likesCountInfo.dislikesCount,
                myStatus: "None"
            }
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
        const isUpdated: boolean = await this.likesService.likeDislike(req.user!.accountData.id, req.params.id, req.body.likeStatus,)
        if (isUpdated) {
            res.sendStatus(204)
            return
        } else {
            res.sendStatus(404)
            return
        }

    }
}

