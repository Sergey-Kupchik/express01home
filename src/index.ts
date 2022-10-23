import express, {Request, Response} from 'express';
import bodyParser from "body-parser";
import {videosRouter} from "./routes/videos-router";
import {productsRouter} from "./routes/products-router";
import {blogsRouter} from "./routes/blogs-router";

const app = express()
const port = process.env.PORT || 5003;
const parsesMiddleware = bodyParser({})


app.use(parsesMiddleware);

app.use('/videos', videosRouter);
app.use('/product', productsRouter);
app.use('/blogs', blogsRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello root')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})