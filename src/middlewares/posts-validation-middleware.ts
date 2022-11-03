import {body, CustomValidator} from "express-validator";
import { BlogType} from "../services/blogs-service";
import {blogsQueryRepository} from "../repositories/queries/blogs-query-repository";


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
    const blog: BlogType | null = await blogsQueryRepository.getBlogById(value.toString());
    if (blog !== null) {
        return true;
    } else {
        return Promise.reject('we do not have this blogId');
    }
};
const blogIdValidation = body('blogId')
    .isString().trim().notEmpty().custom(isValidBlogId);
export {blogIdValidation, titleValidation, shortDescriptionValidation, contentValidation};