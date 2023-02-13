import {PostsRepo} from "../../repositories/posts-db-repository";
import {BlogsRepo} from "../../repositories/blogs-db-repository";
import {UsersQueryRepo} from "../../repositories/queries/users-query-repository";
import {CommentsQueryRepo} from "../../repositories/queries/comments-query-repository";
import {RefreshTokensRepo} from "../../repositories/refresh-token-repository";
import {Request, Response} from "express";

export class TestingController {
    constructor(
        protected postsRepository: PostsRepo,
        protected blogsRepository: BlogsRepo,
        protected usersQueryRepository: UsersQueryRepo,
        protected commentsQueryRepository: CommentsQueryRepo,
        protected refreshTokensRepo: RefreshTokensRepo,
    ) {
    }

    async deleteAll(req: Request, res: Response) {
        await this.postsRepository.deleteAllPosts()
        await this.blogsRepository.deleteAllBlogs()
        await this.usersQueryRepository.deleteAllUser()
        await this.commentsQueryRepository.deleteAllComments()
        await this.refreshTokensRepo.deleteAllTokens()
        res.sendStatus(204)
        return
    }
}
