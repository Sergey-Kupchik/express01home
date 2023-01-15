import * as dotenv from 'dotenv';
import express, {Request, Response} from 'express';
import {videosRouter} from "./routes/videos-router";
import {productsRouter} from "./routes/products-router";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {testingRouter} from "./routes/testing-router";
import {connectToDatabase} from "./server/db/conn";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from "./routes/comments-router";
import cookieParser from "cookie-parser";
import {securityRouter} from "./routes/security-router";

dotenv.config();

const app = express()
const port = process.env.PORT;
const parsesMiddleware = express.json()

app.use(parsesMiddleware);
app.use(cookieParser());
app.set('trust proxy', true)

app.use('/videos', videosRouter);
app.use('/product', productsRouter);
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/testing', testingRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);
app.use('/security', securityRouter);


app.get('/', (req: Request, res: Response) => {
    res.send(`1/15/23 at 4.53 pm`)
})

const startApp = async () => {
    await connectToDatabase()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
};
startApp();