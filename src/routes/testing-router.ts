import {Request, Response, Router} from 'express';
import {postsRepository} from "../repositories/posts-repository";
import {blogsRepository} from "../repositories/blogs-repository";

const testingRouter = Router();

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await postsRepository.deleteAllPosts()
    await blogsRepository.deleteAllBlogs()
    res.send(204)
});
export {testingRouter};