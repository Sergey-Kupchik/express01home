import {dbCollections} from "../../server/db/conn";
import { PostType} from "../../services/posts-service";


const postsQueryRepository = {
    async getAllPosts(): Promise<PostType[]> {
        return await dbCollections.posts.find({}, {projection: {_id: 0}}).toArray();
    },
    async getPostById(id: string): Promise<PostType | null> {
        const searchResult = await dbCollections.posts.findOne({id}, {projection: {_id: 0}})
        return searchResult;
    },
};


export {
    postsQueryRepository
}