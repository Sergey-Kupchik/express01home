import {Router} from 'express';
import {authJwt, isAuthT} from "../middlewares/isAuth-middleware";
import {inputValidationMiddleware} from "../middlewares/validation-middleware";
import {
    blogIdValidation,
    contentCommentsValidation,
    contentValidation,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/posts-validation-middleware";
import { myContainer } from '../inversify.config';
import { PostsController } from './controllers/posts-controller';
import {postsController} from "../composition-root";

// const postsController = myContainer.get<PostsController>(PostsController);

const postsRouter = Router();

postsRouter.get('/',
    postsController.getFilteredPosts.bind(postsController)
);
postsRouter.get('/:id',
    postsController.getPostById.bind(postsController)
);
postsRouter.put('/:id',
    isAuthT,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    postsController.updatePost.bind(postsController)
);

postsRouter.delete('/:id',
    isAuthT,
    inputValidationMiddleware,
    postsController.deletePostById.bind(postsController)
);

postsRouter.post('/',
    isAuthT,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    postsController.createPost.bind(postsController)
)

postsRouter.post('/:id/comments',
    authJwt,
    contentCommentsValidation,
    inputValidationMiddleware,
    postsController.createComment.bind(postsController)
);

postsRouter.get('/:id/comments',
    authJwt,
    postsController.getComments4Post.bind(postsController)
);

export {postsRouter};