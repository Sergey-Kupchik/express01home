import {body, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";

const nameValidation = body('name').isLength({
    min: 3,
    max: 15
}).withMessage('name is required');

const youtubeUrlValidation = body('youtubeUrl').isLength({
    min: 3,
    max: 100
}).withMessage('youtubeUrl is required').isURL().withMessage('should be valid URL value')

const inputBlogsValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errorsMessages: errors.array()});
    } else {
        next()
    }
}

export { nameValidation, youtubeUrlValidation, inputBlogsValidationMiddleware};