import {Request, Response, Router} from 'express';
import {productsRepository} from "../repositories/products-repository";

export const productsRouter = Router();

productsRouter.get('/', (req: Request, res: Response) => {
    const product = productsRepository.findProductByLetterInTitle(req.query.title?.toString())
    res.send(product)
})

productsRouter.post('/', (req: Request, res: Response) => {
    const product = productsRepository.createProduct(req.body.title);
    res.status(201).send(product)
})

productsRouter.put('/:productId', (req: Request, res: Response) => {
    const isProductUpdated = productsRepository.updateProduct(req.params.productId, req.body.title)
    if (isProductUpdated) {
        const product = productsRepository.findProductById(req.params.productId)
        res.status(201).send(product)
    } else {
        res.send(404)
    }
})

productsRouter.get('/:productId', (req: Request, res: Response) => {
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


