import {Collection, MongoClient} from 'mongodb';
import * as mongoDB from "mongodb";
import {PostType} from "../../repositories/posts-in-memory-repository";
import {BlogType} from "../../repositories/blogs-db-repository";

const url = 'mongodb://0.0.0.0:27017';
const dbName = 'first';
const postsCollName = 'posts';
const blogsCollName = 'blogs';
type CollectionsType = {
    posts: Collection<PostType>
    blogs: Collection<BlogType>
}
const collections: CollectionsType = {} as CollectionsType;


const client = new MongoClient(url);

async function connectToDatabase() {
    try {
       await client.connect();
        await client.db(dbName).command({ping:1});
        const postsCollection:Collection<PostType> = await client.db(dbName).collection(postsCollName);
        const blogsCollection:Collection<BlogType> = await client.db(dbName).collection(blogsCollName);
        collections.posts = postsCollection;
        collections.blogs = blogsCollection;
        console.log(`Connected to mongodb server`)
    } catch (error) {
        await client.close()
        console.log(`Failed  to connect  to Database`);
    }
}

export { connectToDatabase, collections}