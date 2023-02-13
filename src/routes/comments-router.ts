import {Router} from 'express';
import {authJwt, authZ} from "../middlewares/isAuth-middleware";
import {inputValidationMiddleware} from "../middlewares/validation-middleware";
import {contentCommentsValidation} from "../middlewares/posts-validation-middleware";
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

export {
    commentsRouter
}