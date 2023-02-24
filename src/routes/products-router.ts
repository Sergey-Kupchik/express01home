import { Request, Response, Router} from 'express';
import {productsRepository} from "../repositories/inMemory/products-repository";
import {isAuthT} from "../middlewares/isAuth-middleware";
import {inputValidationMiddleware, titleValidation} from "../middlewares/validation-middleware";

const productsRouter = Router();

productsRouter.get('/', (req: Request, res: Response) => {
    const product = productsRepository.findProductByLetterInTitle(req.query.title?.toString())
    return res.send(product)
})

productsRouter.post('/',
    titleValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {
        const product = productsRepository.createProduct(req.body.title);
        return res.status(201).send(product)
    })


productsRouter.put('/:id',
    titleValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {
        const isProductUpdated = productsRepository.updateProduct(req.params.id, req.body.title)
        if (isProductUpdated) {
            const product = productsRepository.findProductById(req.params.id)
            return  res.status(201).send(product)
        } else {
            return   res.sendStatus(404)
        }
    })

productsRouter.get('/:productId',
    isAuthT,
    (req: Request, res: Response) => {
        const product = productsRepository.findProductById(req.params.productId)
        if (product) {
            return    res.send(product)
        } else {
            return res.sendStatus(404)
        }
    })

productsRouter.delete('/:productId', (req: Request, res: Response) => {
    const isProductDeleted = productsRepository.deleteProductById(req.params.productId)
    if (isProductDeleted) {
        return res.sendStatus(204)
    } else {
        return res.sendStatus(404)
    }
})


export { productsRouter}