import {Post} from "../../server/db/conn";
import {PostType} from "../../services/posts-service";
import {sortDirectionEnum, sortDirectionType} from "./blogs-query-repository";

class PostsQueryRepo {
    async getAllPosts(): Promise<PostType[]> {
        const result = await Post.find({}, '-_id  -__v').lean();
        return result;
    }

    async getPostById(id: string): Promise<PostType | null> {
        const result = await Post.findOne({id}, '-_id  -__v').lean();
        return result;
    }

    async getAllPostsFor1Blog(blogId: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: sortDirectionType): Promise<PostsOutputType> {
        const filterParam = {blogId}
        const totalCount: number = await Post.find(filterParam).count()
        const pagesCount: number = Math.ceil(totalCount / pageSize);
        const sortDirectionParam = sortDirection === sortDirectionEnum.asc ? 1 : -1;
        const skipItems: number = (pageNumber - 1) * pageSize;
        const posts: PostType[] = await Post.find(filterParam, '-_id  -__v')
            .sort({sortBy: sortDirectionParam})
            .skip(skipItems)
            .limit(pageSize)
        const PostsOutput = {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts
        }
        return PostsOutput;
    }

    async getFilteredPosts(pageNumber: number, pageSize: number, sortBy: string, sortDirection: sortDirectionType): Promise<PostsOutputType> {
        const filterParam = {}
        const totalCount: number = await Post.find(filterParam, '-_id  -__v').count()
        const pagesCount: number = Math.ceil(totalCount / pageSize);
        const sortDirectionParam = sortDirection === sortDirectionEnum.asc ? 1 : -1;
        const skipItems: number = (pageNumber - 1) * pageSize;
        const posts = await Post.find(filterParam, '-_id  -__v')
            .sort({sortBy: sortDirectionParam})
            .skip(skipItems)
            .limit(pageSize).lean()
        const PostsOutput = {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts
        }
        return PostsOutput;
    }
}

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
    PostsOutputType, PostsQueryRepo
}