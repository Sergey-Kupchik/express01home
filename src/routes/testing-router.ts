import {Request, Response, Router} from 'express';
import {PostsRepo} from "../repositories/posts-db-repository";
import {BlogsRepo} from "../repositories/blogs-db-repository";
import {UsersQueryRepo} from "../repositories/queries/users-query-repository";
import {CommentsQueryRepo} from "../repositories/queries/comments-query-repository";
import {RefreshTokensRepo} from "../repositories/refresh-token-repository";

const testingRouter = Router();

class TestingRouter {
    private postsRepository: PostsRepo;
    private blogsRepository: BlogsRepo;
    private usersQueryRepository: UsersQueryRepo;
    private commentsQueryRepository: CommentsQueryRepo;
    private refreshTokensRepo: RefreshTokensRepo;

    constructor() {
        this.postsRepository = new PostsRepo()
        this.blogsRepository = new BlogsRepo()
        this.usersQueryRepository = new UsersQueryRepo()
        this.commentsQueryRepository = new CommentsQueryRepo()
        this.refreshTokensRepo = new RefreshTokensRepo()
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

const testing = new TestingRouter();

testingRouter.delete('/all-data',
    testing.deleteAll.bind(testing)
);
export {testingRouter};