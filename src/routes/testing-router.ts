import {Router} from 'express';
import {testingController} from "../composition-root";

const testingRouter = Router();

testingRouter.delete('/all-data',
    testingController.deleteAll.bind(testingController)
);
export {testingRouter};