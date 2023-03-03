import {Router} from 'express';
import {authJwt, authJwtNoError, authZ, commentIdValidation} from "../middlewares/isAuth-middleware";
import {inputValidationMiddleware} from "../middlewares/validation-middleware";
import {contentCommentsValidation, likeStatusValidation} from "../middlewares/posts-validation-middleware";
import { myContainer } from '../inversify.config';
import { CommentsController } from './controllers/comments-controller';

const commentsController = myContainer.get<CommentsController>(CommentsController);

const commentsRouter = Router();

commentsRouter.delete('/:id',
    authJwt,
    authZ,
    commentsController.deleteCommentById.bind(commentsController)
);

commentsRouter.get('/:id',
    authJwtNoError,
    // commentIdValidation,
    commentsController.getCommentById.bind(commentsController)
);
commentsRouter.put('/:id',
    authJwt,
    authZ,
    contentCommentsValidation,
    inputValidationMiddleware,
    commentsController.updateCommentById.bind(commentsController)
);
commentsRouter.put('/:id/like-status',
    authJwt,
    commentIdValidation,
    likeStatusValidation,
    inputValidationMiddleware,
    commentsController.likeDislikeComment.bind(commentsController)
);

export {
    commentsRouter
}