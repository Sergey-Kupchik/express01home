import express, {Request, Response} from 'express';

const app = express()
const port = process.env.PORT || 3003;

app.get('/', (req:any, res:any) => {

    let helloWorld = 'Hello World!';
    res.send(helloWorld)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})