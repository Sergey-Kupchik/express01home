import {Collection, MongoClient} from 'mongodb';
import {PostType} from "../../services/posts-service";
import {BlogType} from "../../services/blogs-service";
import {UserDdType} from "../../repositories/users-db-repository";
import {CommentType} from "../../services/coments-service";
import mongoose, {model, connect} from 'mongoose';
import * as dotenv from 'dotenv'
import {blogSchema, commentSchema, postSchema, refreshTokensInfoSchema, userSchema} from "./schemas";
import {BlogDbType, CommentDbType, PostDbType, RefreshTokensInfoDbType, UserDbType} from "./types";

dotenv.config()

const mongoUrl = process.env.MONGO_URL;
const mongooseUrl = process.env.MONGOOSE_URL;
const dbName = 'second?retryWrites=true&w=majority';
const client = new MongoClient(mongoUrl!);
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


const postsCollName = 'posts';
const blogsCollName = 'blogs';
const usersCollName = 'users';
const commentsCollName = 'comments';
const refreshTokensCollName = 'refreshTokens';

type dbCollectionsType = {
    posts: Collection<PostType>
    blogs: Collection<BlogType>
    users: Collection<UserDdType>
    comments: Collection<CommentType>
    refreshTokens: Collection<RefreshTokensInfoType>
}
const dbCollections: dbCollectionsType = {} as dbCollectionsType;

async function connectToDatabase() {
    try {
        await client.connect();
        await client.db(dbName).command({ping: 1});
        const postsCollection: Collection<PostType> = await client.db(dbName).collection(postsCollName);
        const blogsCollection: Collection<BlogType> = await client.db(dbName).collection(blogsCollName);
        const usersCollection: Collection<UserDdType> = await client.db(dbName).collection(usersCollName);
        const commentsCollection: Collection<CommentType> = await client.db(dbName).collection(commentsCollName);
        const refreshTokensCollection: Collection<RefreshTokensInfoType> = await client.db(dbName).collection(refreshTokensCollName);
        dbCollections.posts = postsCollection;
        dbCollections.blogs = blogsCollection;
        dbCollections.users = usersCollection;
        dbCollections.comments = commentsCollection;
        dbCollections.refreshTokens = refreshTokensCollection;
        console.log(`Connected to mongodb server`)
    } catch (error) {
        await client.close()
        console.log(`Failed  to connect  to Database`);
    }
}

export {connectToDatabase, dbCollections}


type RefreshTokensInfoType = {
    userId: string,
    refreshTokensInfo: Array<{
        deviceId: string,
        lastActiveDate: string,
        ip: string,
        title: string,
        expiresIn: string,
    }>
}

