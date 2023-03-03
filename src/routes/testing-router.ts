import { Router } from 'express';
import { myContainer } from '../inversify.config';
import { TestingController } from './controllers/testing-controller';

const testingRouter = Router();

const testingController = myContainer.get<TestingController>(TestingController);

testingRouter.delete('/all-data',
    testingController.deleteAll.bind(testingController)
);
export { testingRouter };
