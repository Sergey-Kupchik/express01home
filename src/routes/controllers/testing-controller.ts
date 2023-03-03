import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BlogsRepo } from "../../repositories/blogs-db-repository";
import { PostsRepo } from "../../repositories/posts-db-repository";
import { CommentsQueryRepo } from "../../repositories/queries/comments-query-repository";
import { LikeQueryRepo } from "../../repositories/queries/likes-query-repository";
import { UsersQueryRepo } from "../../repositories/queries/users-query-repository";
import { RefreshTokensRepo } from "../../repositories/refresh-token-repository";

@injectable()
export class TestingController {
    constructor(
        @inject(PostsRepo) protected postsRepository: PostsRepo,
        @inject(BlogsRepo) protected blogsRepository: BlogsRepo,
        @inject(UsersQueryRepo) protected usersQueryRepository: UsersQueryRepo,
        @inject(CommentsQueryRepo) protected commentsQueryRepository: CommentsQueryRepo,
        @inject(RefreshTokensRepo) protected refreshTokensRepo: RefreshTokensRepo,
        @inject(LikeQueryRepo) protected likesQueryRepository: LikeQueryRepo,
    ) {
    }

    async deleteAll(req: Request, res: Response) {
        await this.postsRepository.deleteAllPosts()
        await this.blogsRepository.deleteAllBlogs()
        await this.usersQueryRepository.deleteAllUser()
        await this.commentsQueryRepository.deleteAllComments()
        await this.refreshTokensRepo.deleteAllTokens()
        await this.likesQueryRepository.deleteAllInstance()
        res.sendStatus(204)
        return
    }
}
