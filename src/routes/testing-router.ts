import {Request, Response, Router} from 'express';
import {postsRepository} from "../repositories/posts-db-repository";
import {blogsRepository} from "../repositories/blogs-db-repository";

const testingRouter = Router();

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await postsRepository.deleteAllPosts()
    await blogsRepository.deleteAllBlogs()
    res.send(204)
});
export {testingRouter};