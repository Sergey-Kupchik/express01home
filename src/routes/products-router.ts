import {Request, Response, Router} from 'express';
import {newId} from "./videos-router";

export const productsRouter = Router();


const products: ProductType[] = [{id:1, title:"Orange"},{id:2, title:"Melon"},{id:3, title:"Pumpkin"},{id:4, title:"apple"},{id:5, title:"tomato"}]

productsRouter.get('/', (req:Request, res:Response) => {
    if (req.query.title) {
        const searchStr = req.query.title.toString()
        const product = products.find(p=>p.title.indexOf(searchStr)>-1)
        res.send(product)
    } else {
        res.send(products)
    }
})

productsRouter.post('/', (req:Request, res:Response) => {
    const newProduct:ProductType = {
        id: newId(),
        title: req.body.title
    }
    products.push(newProduct);
    res.status(201).send(newProduct)
})

productsRouter.put('/:productId', (req:Request, res:Response) => {
    const product = products.find(p=>p.id===+req.params.productId)
    if (product) {
        product.title=req.body.title
        res.send(201)
    } else {
        res.send(404)
    }
})

productsRouter.get('/:productId', (req:Request, res:Response) => {
    const product = products.find(p=>p.id===+req.params.productId)
    if (product) {
        res.send(product)
    } else {
        res.send(404)
    }
})

productsRouter.delete('/:productId', (req:Request, res:Response) => {
    for (let i=0; i<products.length; i++ ){
        if (products[i].id===+req.params.productId){
            products.splice(i,1)
            res.send(204)
            return
        }
    }
    res.send(404)
})


type ProductType = {
    id:number
    title:string
}
