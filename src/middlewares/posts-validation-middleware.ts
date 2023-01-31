import {body, CustomValidator, param} from "express-validator";
import {BlogType} from "../services/blogs-service";
import {blogsQueryRepository} from "../repositories/queries/blogs-query-repository";


const titleValidation = body("title")
    .isString().withMessage(`title should be string`)
    .trim().withMessage(`title should be symbols string`)
    .notEmpty().withMessage(`title  is required`)
    .isLength({max: 30}).withMessage(`length is 30 max`);

const descriptionValidation = body("description")
    .isString().withMessage(`description should be string`)
    .trim().withMessage(`description should be symbols string`)
    .notEmpty().withMessage(`description  is required`)
    .isLength({max: 500}).withMessage(`length is 500 max`);

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

const contentCommentsValidation = body("content")
    .isString().withMessage(`content should be string`)
    .trim().withMessage(`content should be symbols string`)
    .notEmpty().withMessage(`content  is required`)
    .isLength({min:20 ,max: 300}).withMessage(`length in range min:20 ,max: 300`);

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

const urlBlogIdValidation = param('blogId')
    .isString().trim().notEmpty().isLength({min: 2}).custom(isValidBlogId);


export {blogIdValidation, titleValidation, shortDescriptionValidation, contentValidation, urlBlogIdValidation, descriptionValidation, contentCommentsValidation};