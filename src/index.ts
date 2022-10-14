import express, {Request, Response} from 'express';
import bodyParser from "body-parser";
import {videosRouter} from "./routes/videos-router";
import {productsRouter} from "./routes/products-router";

const app = express()
const port = process.env.PORT || 5003;
const parsesMiddleware = bodyParser({})

app.use(parsesMiddleware);

app.use('/videos', videosRouter);
app.use('/product', productsRouter);

app.get('/', (req: Request, res: Response) => {
    const title = "Welcome to my heroku node.js APP!";
    res.send(title)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})