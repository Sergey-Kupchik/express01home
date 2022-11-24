import {Request, Response, Router} from 'express';
import {postsRepository} from "../repositories/posts-db-repository";
import {blogsRepository} from "../repositories/blogs-db-repository";
import {usersQueryRepository} from "../repositories/queries/users-query-repository";
import {commentsQueryRepository} from "../repositories/queries/comments-query-repository";

const testingRouter = Router();

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await postsRepository.deleteAllPosts()
    await blogsRepository.deleteAllBlogs()
    await usersQueryRepository.deleteAllUser()
    await commentsQueryRepository.deleteAllComments()
     res.send(204)
     return
});
export {testingRouter};