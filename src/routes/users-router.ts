import { Router } from 'express';
import { myContainer } from '../inversify.config';
import { isAuthT } from "../middlewares/isAuth-middleware";
import { emailValidator, loginValidation, passwordValidation } from "../middlewares/user-middleware";
import { inputValidationMiddleware } from "../middlewares/validation-middleware";
import { UsersController } from './controllers/users-controller';

const usersController = myContainer.get<UsersController>(UsersController);

const usersRouter = Router();

usersRouter.post('/',
    isAuthT,
    loginValidation,
    emailValidator,
    passwordValidation,
    inputValidationMiddleware, usersController.createUser.bind(usersController));

usersRouter.get('/',
    isAuthT,
    inputValidationMiddleware,
    inputValidationMiddleware, usersController.getAllUser.bind(usersController));

usersRouter.delete('/:id',
    isAuthT,
    inputValidationMiddleware,
    inputValidationMiddleware, usersController.deleteUserById.bind(usersController));

export {
    usersRouter
};
