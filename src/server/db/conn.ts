import {Collection, MongoClient} from 'mongodb';
import {PostType} from "../../services/posts-service";
import {BlogType} from "../../services/blogs-service";
import {UserDdType} from "../../repositories/users-db-repository";
import {CommentType} from "../../services/coments-service";
import * as dotenv from 'dotenv'
dotenv.config()

const url = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017';
const client = new MongoClient(process.env.MONGO_URL!);

const dbName = 'first';
const postsCollName = 'posts';
const blogsCollName = 'blogs';
const usersCollName = 'users';
const commentsCollName = 'comments';
type dbCollectionsType = {
    posts: Collection<PostType>
    blogs: Collection<BlogType>
    users: Collection<UserDdType>
    comments: Collection<CommentType>
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
        dbCollections.posts = postsCollection;
        dbCollections.blogs = blogsCollection;
        dbCollections.users = usersCollection;
        dbCollections.comments = commentsCollection;
        console.log(`Connected to mongodb server`)
    } catch (error) {
        await client.close()
        console.log(`Failed  to connect  to Database`);
    }
}

export {connectToDatabase, dbCollections}