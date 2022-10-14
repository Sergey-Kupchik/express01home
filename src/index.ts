import express, {Request, Response} from 'express';

const app = express()
const port = process.env.PORT || 5003;

type ProductType = {
    id:string
    title:string
}
type AddressType = {
    id:number
    city:string
}

const products: ProductType[] = [{id:"1", title:"Orange"},{id:"2", title:"Melon"},{id:"3", title:"Pumpkin"}]
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

app.get('/product/:productId', (req:Request, res:Response) => {
    const product = products.find(p=>p.id===req.params.productId)
    if (product) {
        res.send(product)
    } else {
        res.send(404)
    }
})

app.delete('/product/:productId', (req:Request, res:Response) => {
    const product = products.find(p=>p.id===req.params.productId)
    for (let i=0; i=0; i++ ){
        if (products[i].id===req.params.productId){
            products.slice(i,1)
            res.send(200)
            return
        } else {
            res.send(404)
        }
    }
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