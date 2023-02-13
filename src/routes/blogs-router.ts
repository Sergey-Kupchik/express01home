import {Router} from 'express';
import {isAuthT} from "../middlewares/isAuth-middleware";
import {nameValidation, websiteUrlValidation} from "../middlewares/blogs-validation-middleware";
import {inputValidationMiddleware, inputValidationMiddleware2} from "../middlewares/validation-middleware";
import {
    contentValidation,
    descriptionValidation,
    shortDescriptionValidation,
    titleValidation,
    urlBlogIdValidation
} from "../middlewares/posts-validation-middleware";
import {blogsController} from "../composition-root";

const blogsRouter = Router();

blogsRouter.get('/',
    blogsController.getFilteredBlogs.bind(blogsController)
);

blogsRouter.get('/:id',
    blogsController.getBlogById.bind(blogsController)
);

blogsRouter.post('/',
    isAuthT,
    nameValidation,
    websiteUrlValidation,
    descriptionValidation,
    inputValidationMiddleware,
    blogsController.createBlog.bind(blogsController)
);

blogsRouter.post('/:blogId/posts',
    urlBlogIdValidation,
    inputValidationMiddleware2,
    isAuthT,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware,
    blogsController.createPost.bind(blogsController)
);

blogsRouter.get('/:blogId/posts',
    urlBlogIdValidation,
    inputValidationMiddleware2,
    blogsController.getAllPostsFor1Blog.bind(blogsController)
);

blogsRouter.put('/:id',
    isAuthT,
    nameValidation,
    websiteUrlValidation,
    descriptionValidation,
    inputValidationMiddleware,
    blogsController.updateBlog.bind(blogsController)
);

blogsRouter.delete('/:id',
    isAuthT,
    blogsController.deleteBlogById.bind(blogsController));

export {
    blogsRouter
}