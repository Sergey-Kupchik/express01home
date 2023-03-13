import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { CommentsQueryRepo } from "../../repositories/queries/comments-query-repository";
import { LikeQueryRepo } from "../../repositories/queries/likes-query-repository";
import { CommentsService } from "../../services/coments-service";
import { LikesService } from "../../services/likes-service";

@injectable()
export class CommentsController {

    constructor(@inject(CommentsQueryRepo) protected commentsQueryRepository: CommentsQueryRepo,
        @inject(CommentsService) protected commentsService: CommentsService,
        @inject(LikesService) protected likesService: LikesService,
        @inject(LikeQueryRepo) protected likesQueryRepository: LikeQueryRepo,
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
        let myStatus = "None";
        if (req.user?.accountData.id) {
            myStatus = await this.likesQueryRepository.getCommentLikeStatus4User(req.user?.accountData.id, req.params.id)
        }

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
                myStatus: myStatus
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

    async likeDislikeComment(req: Request, res: Response) {
        const isUpdated: boolean = await this.likesService.likeDislikeComment(req.user!.accountData.id, req.params.id, req.body.likeStatus,)
        if (isUpdated) {
            res.sendStatus(204)
            return
        } else {
            res.sendStatus(404)
            return
        }
    }
}

