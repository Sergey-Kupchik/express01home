import mongoose, {connect, model} from 'mongoose';
import * as dotenv from 'dotenv'
import {blogSchema, commentSchema, postSchema, refreshTokensInfoSchema, userSchema} from "./schemas";
import {BlogDbType, CommentDbType, PostDbType, RefreshTokensInfoDbType, UserDbType} from "./types";

dotenv.config()

const mongooseUrl = process.env.MONGOOSE_URL;
const dbName = 'second?retryWrites=true&w=majority';
mongoose.set("strictQuery", false);

async function connectToDb() {
    try {
        await connect(`${mongooseUrl}/${dbName}`);
        console.log(`Connected to mongodb server used Mongoose`)
    } catch (e) {
        console.error(`Failed  to connect to Database` + e);
    }
}

const User = model<UserDbType>('Users', userSchema);
const Post = model<PostDbType>('Posts', postSchema);
const Blog = model<BlogDbType>('Blogs', blogSchema);
const Comment = model<CommentDbType>('Comments', commentSchema);
const RefreshTokenInfo = model<RefreshTokensInfoDbType>('RefreshTokensInfo', refreshTokensInfoSchema);


export {connectToDb, User, Post, Blog, Comment, RefreshTokenInfo}


