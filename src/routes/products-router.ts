import {NextFunction, Request, Response, Router} from 'express';
import {productsRepository} from "../repositories/products-repository";
import {body, validationResult, param} from 'express-validator';

const productsRouter = Router();
const titleValidation = body('title').isLength({
    min: 3,
    max: 30
}).withMessage('title must be from 3 to 30 symbols');
// const idIsRequiredMiddleware = param('id').exists().withMessage('id is Required');
const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    } else {
        next()
    }
}

const isAuthZ = (req: Request, res: Response, next: NextFunction) => {
    const basicToken = req.headers["authorization"]
    if (basicToken === "Basic YWRtaW46cXdlcnR5") {
        next()
    } else {
        res.send(401)
    }
}

productsRouter.get('/', (req: Request, res: Response) => {
    const product = productsRepository.findProductByLetterInTitle(req.query.title?.toString())
    res.send(product)
})

productsRouter.post('/',
    titleValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {
        const product = productsRepository.createProduct(req.body.title);
        res.status(201).send(product)
    })


productsRouter.put('/:id',
    // idIsRequiredMiddleware,
    titleValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {
        const isProductUpdated = productsRepository.updateProduct(req.params.id, req.body.title)
        if (isProductUpdated) {
            const product = productsRepository.findProductById(req.params.id)
            res.status(201).send(product)
        } else {
            res.send(404)
        }
    })

productsRouter.get('/:productId',
    isAuthZ,
    (req: Request, res: Response) => {
        const product = productsRepository.findProductById(req.params.productId)
        if (product) {
            res.send(product)
        } else {
            res.send(404)
        }
    })

productsRouter.delete('/:productId', (req: Request, res: Response) => {
    const isProductDeleted = productsRepository.deleteProductById(req.params.productId)
    if (isProductDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }
})


export {isAuthZ, productsRouter}