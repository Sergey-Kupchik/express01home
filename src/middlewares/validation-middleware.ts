import {body,param, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";

const titleValidation = body('title').isLength({
    min: 3,
    max: 30
}).withMessage('title must be from 3 to 30 symbols');


const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errorsMessages: errors.array({onlyFirstError: true}).map(e => ({
                message: e.msg,
                field: e.param
            }))
        });
    } else {
        next()
    }
};
const inputValidationMiddleware2 = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({
            errorsMessages: errors.array({onlyFirstError: true}).map(e => ({
                message: e.msg,
                field: e.param
            }))
        });
    } else {
        next()
    }
};
export {titleValidation, inputValidationMiddleware,inputValidationMiddleware2};