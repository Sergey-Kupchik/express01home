import {Router} from 'express';
import {authJwt, authZ, commentIdValidation} from "../middlewares/isAuth-middleware";
import {inputValidationMiddleware} from "../middlewares/validation-middleware";
import {contentCommentsValidation, likeStatusValidation} from "../middlewares/posts-validation-middleware";
import {commentsController} from "../composition-root";

const commentsRouter = Router();

commentsRouter.delete('/:id',
    authJwt,
    authZ,
    commentsController.deleteCommentById.bind(commentsController)
);

commentsRouter.get('/:id',
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
    commentsController.likeDislike.bind(commentsController)
);

export {
    commentsRouter
}