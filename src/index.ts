import express, {Request, Response} from 'express';
import bodyParser from "body-parser";

const app = express()
const port = process.env.PORT || 5003;
const parsesMiddleware = bodyParser({})
app.use(parsesMiddleware);

type ProductType = {
    id:number
    title:string
}
type AddressType = {
    id:number
    city:string
}

const products: ProductType[] = [{id:1, title:"Orange"},{id:2, title:"Melon"},{id:3, title:"Pumpkin"},{id:4, title:"apple"},{id:5, title:"tomato"}]
const addresses: AddressType[] = [{id:3, city:"Atlanta"},{id:4, city:"Orlando"}]

app.get('/product', (req:Request, res:Response) => {
    if (req.query.title) {
        const searchStr = req.query.title.toString()
        const product = products.find(p=>p.title.indexOf(searchStr)>-1)
        res.send(product)
    } else {
        res.send(products)
    }
})

app.post('/product', (req:Request, res:Response) => {
    const newProduct:ProductType = {
        id: +(new Date()),
        title: req.body.title
    }
    products.push(newProduct);
    res.status(201).send(newProduct)
})

app.put('/product/:productId', (req:Request, res:Response) => {
    const product = products.find(p=>p.id===+req.params.productId)
    if (product) {
        product.title=req.body.title
        res.send(201)
    } else {
        res.send(404)
    }
})

app.get('/product/:productId', (req:Request, res:Response) => {
    const product = products.find(p=>p.id===+req.params.productId)
    if (product) {
        res.send(product)
    } else {
        res.send(404)
    }
})

app.delete('/product/:productId', (req:Request, res:Response) => {
    for (let i=0; i<products.length; i++ ){
        if (products[i].id===+req.params.productId){
            products.splice(i,1)
            res.send(204)
            return
        }
    }
    res.send(404)
})

app.get('/city', (req:Request, res:Response) => {
    const cityId = req.query.id;
    const result = addresses.find(c=>c.id.toString()===cityId)
    if (result) {
        res.send(result)
    } else {
        res.send(addresses)
    }
})

app.get('/', (req:Request, res:Response) => {
    const title = "Welcom to my heroku node.js APP";
    res.send(title)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})