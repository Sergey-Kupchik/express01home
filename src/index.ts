import * as dotenv from 'dotenv';
dotenv.config();
import express, {Request, Response} from 'express';
import {videosRouter} from "./routes/videos-router";
import {productsRouter} from "./routes/products-router";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {testingRouter} from "./routes/testing-router";
import {connectToDatabase} from "./server/db/conn";
import {filteredBlogsRouter} from "./routes/filtered-blogs-router";
import {filteredPostsRouter} from "./routes/filtered-posts-router";

const app = express()
const port = process.env.PORT;
const parsesMiddleware = express.json()

app.use(parsesMiddleware);

app.use('/videos', videosRouter);
app.use('/product', productsRouter);
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/testing', testingRouter);
app.use('/testing', testingRouter);
app.use('/blogsfilter', filteredBlogsRouter);
app.use('/postsfilter', filteredPostsRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello root')
})

const startApp = async () => {
    await connectToDatabase()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
};
startApp();