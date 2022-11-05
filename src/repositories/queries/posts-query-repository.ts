import {dbCollections} from "../../server/db/conn";
import {PostType} from "../../services/posts-service";
import {sortDirectionEnum, sortDirectionType} from "./blogs-query-repository";


const postsQueryRepository = {
    async getAllPosts(): Promise<PostType[]> {
        return await dbCollections.posts.find({}, {projection: {_id: 0}}).toArray();
    },
    async getPostById(id: string): Promise<PostType | null> {
        const searchResult = await dbCollections.posts.findOne({id}, {projection: {_id: 0}})
        return searchResult;
    },
    async getAllPostsFor1Blog(blogId: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: sortDirectionType): Promise<PostsOutputType> {
        // const totalCount: number = await dbCollections.blogs.estimatedDocumentCount();
        const filterParam = {blogId}
        const totalCount: number = await dbCollections.blogs.find(filterParam, {projection: {_id: 0}}).count()
        const pagesCount: number = Math.ceil(totalCount / pageSize);
        const sortDirectionParam = sortDirection === sortDirectionEnum.asc ? 1 : -1;
        const skipItems: number = (pageNumber - 1) * pageSize;
        const posts: PostType[] = await dbCollections.posts.find(filterParam, {projection: {_id: 0}})
            .sort(sortBy, sortDirectionParam)
            .skip(skipItems)
            .limit(pageSize).toArray()
        const PostsOutput = {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts
        }
        return PostsOutput;
    },
    async getFilteredPosts(pageNumber: number, pageSize: number, sortBy: string, sortDirection: sortDirectionType): Promise<PostsOutputType> {
        // const totalCount: number = await dbCollections.blogs.estimatedDocumentCount();
        const filterParam = {}
        const totalCount: number = await dbCollections.blogs.find(filterParam, {projection: {_id: 0}}).count()
        const pagesCount: number = Math.ceil(totalCount / pageSize);
        const sortDirectionParam = sortDirection === sortDirectionEnum.asc ? 1 : -1;
        const skipItems: number = (pageNumber - 1) * pageSize;
        const posts = await dbCollections.posts.find(filterParam, {projection: {_id: 0}})
            .sort(sortBy, sortDirectionParam)
            .skip(skipItems)
            .limit(pageSize).toArray()
        const PostsOutput = {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts
        }
        return PostsOutput;
    },

};

type PostsOutputType = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": Array<{
        id: string
        title: string
        shortDescription: string
        content: string
        blogId: string
        blogName: string
        createdAt: string
    }>
}

export {
    postsQueryRepository, PostsOutputType
}