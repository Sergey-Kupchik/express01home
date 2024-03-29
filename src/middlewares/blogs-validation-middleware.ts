import {body, param} from "express-validator";

const nameValidation = body('name')
    .isString().withMessage('name should be string')
    .trim().withMessage('name should be symbols string')
    .notEmpty().withMessage('name is required')
    .isLength({max: 15}).withMessage('max length is 15');


const idValidation = param('id').isLength({max: 2}).isString().trim().notEmpty().withMessage('max length is 3');

const websiteUrlValidation = body('websiteUrl')
    .isString().withMessage('websiteUrl should be string')
    .trim().withMessage('websiteUrl should be symbols string')
    .notEmpty().withMessage('websiteUrl is required')
    .isLength({ max: 100}).withMessage('max length is 100')
    .isURL().withMessage('should be valid URL value');


export {nameValidation, websiteUrlValidation, idValidation};