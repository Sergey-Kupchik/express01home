import {Request, Response, Router} from 'express';
import {testingRepository} from "../repositories/testing-repository";

const testingRouter = Router();

testingRouter.delete('/all-data', (req: Request, res: Response) => {
    testingRepository.deleteAllRepositoriesData()
    res.send(204)
});
export {testingRouter};