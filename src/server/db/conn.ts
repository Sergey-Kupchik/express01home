import {Collection, MongoClient} from 'mongodb';
import {PostType} from "../../repositories/posts-in-memory-repository";
import {BlogType} from "../../repositories/blogs-db-repository";


const url = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017';

const client = new MongoClient(url);

const dbName = 'first';
const postsCollName = 'posts';
const blogsCollName = 'blogs';
type dbCollectionsType = {
    posts: Collection<PostType>
    blogs: Collection<BlogType>
}
const dbCollections: dbCollectionsType = {} as dbCollectionsType;

// export const postsCollection =  client.db(dbName).collection<PostType>(postsCollName)
// export const blogsCollection =  client.db(dbName).collection<BlogType>(blogsCollName)

async function connectToDatabase() {
    try {
        console.log(url);

       await client.connect();
        await client.db(dbName).command({ping:1});
        const postsCollection:Collection<PostType> = await client.db(dbName).collection(postsCollName);
        const blogsCollection:Collection<BlogType> = await client.db(dbName).collection(blogsCollName);
        dbCollections.posts = postsCollection;
        dbCollections.blogs = blogsCollection;
        console.log(`Connected to mongodb server`)
    } catch (error) {
        await client.close()
        console.log(`Failed  to connect  to Database`);
    }
}

export { connectToDatabase, dbCollections}