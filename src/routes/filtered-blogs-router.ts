import {Request, Response, Router} from 'express';
import {BlogType} from "../services/blogs-service";
import {BlogOutputType, blogsQueryRepository} from "../repositories/queries/blogs-query-repository";

const filteredBlogsRouter = Router();

// filteredBlogsRouter.get('/', async (req: Request, res: Response) => {
//     const blogs:BlogOutputType  = await blogsQueryRepository.getFilteredBlogs(1, 10, "createdAt","desc")
//     res.send(blogs)
//     return
// });

filteredBlogsRouter.get('/', async (req: Request, res: Response) => {
    const searchNameTerm = req.query.searchNameTerm?req.query.searchNameTerm:null;
    const page = req.query.pageNumber?+req.query.pageNumber:1;
    const pageSize = req.query.pageSize?+req.query.pageSize:10;
    const sortBy = req.query.sortBy?req.query.sortBy.toString():"createdAt";
    const sortDirection = req.query.sortDirection?req.query.sortDirection.toString():"desc";
    const blogs:BlogOutputType  = await blogsQueryRepository.getFilteredBlogs(searchNameTerm, page, pageSize, sortBy,sortDirection)
    res.send(blogs)
    return
});


export {
    filteredBlogsRouter
}