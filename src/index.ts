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
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
    windowMs: 10000, // 10 sec
    max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
})

dotenv.config();

const app = express()
const port = process.env.PORT;
const parsesMiddleware = express.json()

app.use(parsesMiddleware);
app.use(cookieParser());
app.use('/auth/login', rateLimit({
        windowMs: 10000, // 10 sec
        max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    })
)
app.use('/auth/registration-confirmation', rateLimit({
        windowMs: 10000, // 10 sec
        max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    })
)
app.use('/auth/registration', rateLimit({
        windowMs: 10000, // 10 sec
        max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    })
)
app.use('/auth/registration-email-resending', rateLimit({
        windowMs: 10000, // 10 sec
        max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    })
)
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
    res.send(`1/22/23 at 3.13 pm`)
})

const startApp = async () => {
    await connectToDatabase()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
};
startApp();