import {body, CustomValidator} from "express-validator";
import {blogsService, BlogType} from "../services/blogs-service";


const titleValidation = body("title")
    .isString().withMessage(`title should be string`)
    .trim().withMessage(`title should be symbols string`)
    .notEmpty().withMessage(`title  is required`)
    .isLength({max: 30}).withMessage(`length is 30 max`);

const shortDescriptionValidation = body("shortDescription")
    .isString().withMessage(`shortDescription should be string`)
    .trim().withMessage(`shortDescription should be symbols string`)
    .notEmpty().withMessage(`shortDescription  is required`)
    .isLength({max: 100}).withMessage(`length is 30 max`);

const contentValidation = body("content")
    .isString().withMessage(`content should be string`)
    .trim().withMessage(`content should be symbols string`)
    .notEmpty().withMessage(`content  is required`)
    .isLength({max: 1000}).withMessage(`length is 30 max`);



const isValidBlogId: CustomValidator = async (value) => {
    const blog: BlogType | null = await blogsService.getBlogById(value.toString());
    if (blog !== null) {
        return true;
    } else {
        return Promise.reject('we do not have this blogId');
    }
};
const blogIdValidation = body('blogId')
    .isString().trim().notEmpty().custom(isValidBlogId);
export {blogIdValidation, titleValidation, shortDescriptionValidation, contentValidation};