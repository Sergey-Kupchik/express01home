import {inject, injectable} from "inversify";
import {Post} from "../../server/db/conn";
import {PostType} from "../../services/posts-service";
import {sortDirectionEnum, sortDirectionType} from "./blogs-query-repository";
import {INewestLikes, LikeQueryRepo, LikeQueryRepoEnum} from "./likes-query-repository";

@injectable()
class PostsQueryRepo {
    constructor(
        @inject(LikeQueryRepo) protected likesQueryRepository: LikeQueryRepo,
    ) {
    }

    async getAllPosts(): Promise<PostType[]> {
        const result = await Post.find({}, '-_id  -__v').lean();
        return result;
    }

    async getPostById(id: string): Promise<PostType | null> {
        const result = await Post.findOne({id}, '-_id  -__v').lean();
        return result;
    }

    async getExtendedPostInfoById(extendedPostViewModel: { postId: string, userId: string | undefined }): Promise<IExtendedPost | null> {
        const postId = extendedPostViewModel.postId
        const userId = extendedPostViewModel.userId !== undefined ? extendedPostViewModel.userId : ""
        const post = await this.getPostById(postId);
        if (!post) return null
        const likesCount = await this.likesQueryRepository.getLikesCount4Post(postId)
        const newestLikest = await this.likesQueryRepository.getNewestLikes4Post(postId)
        const userLikestStatus = await this.likesQueryRepository.getPostLikeStatus4User(userId, postId)
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: likesCount.likesCount,
                dislikesCount: likesCount.dislikesCount,
                myStatus: userLikestStatus,
                newestLikes: newestLikest
            }
        };
    }


    async getAllPostsFor1Blog(blogId: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: sortDirectionType, userId: string|undefined ): Promise<PostsOutputType> {
        const filterParam = {blogId}
        const totalCount: number = await Post.find(filterParam).count()
        const pagesCount: number = Math.ceil(totalCount / pageSize);
        const sortDirectionParam = sortDirection === sortDirectionEnum.asc ? 1 : -1;
        const skipItems: number = (pageNumber - 1) * pageSize;
        const posts: PostType[] = await Post.find(filterParam, '-_id  -__v')
            .sort({sortBy: sortDirectionParam})
            .skip(skipItems)
            .limit(pageSize)
        const extendedPosts = await Promise.all(posts.map(async (p)=>await this.getExtendedPostInfoById({ postId:p.id,  userId: userId })))
        const PostsOutput = {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: extendedPosts as IExtendedPost[]
        }
        return PostsOutput;
    }

    async getFilteredPosts(pageNumber: number, pageSize: number, sortBy: string, sortDirection: sortDirectionType, userId: string | undefined ): Promise<PostsOutputType> {
        const filterParam = {}
        const totalCount: number = await Post.find(filterParam, '-_id  -__v').count()
        const pagesCount: number = Math.ceil(totalCount / pageSize);
        const sortDirectionParam = sortDirection === sortDirectionEnum.asc ? 1 : -1;
        const skipItems: number = (pageNumber - 1) * pageSize;
        const posts = await Post.find(filterParam, '-_id  -__v')
            .sort({sortBy: sortDirectionParam})
            .skip(skipItems)
            .limit(pageSize).lean()
        const extendedPosts = await Promise.all(posts.map(async (p)=>await this.getExtendedPostInfoById({ postId:p.id,  userId: userId })))

        const PostsOutput = {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: extendedPosts as IExtendedPost[]
        }
        return PostsOutput;
    }
}

type PostsOutputType = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": IExtendedPost[]
}

type IExtendedPost = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    extendedLikesInfo: IPostsLikesInfo
};

type IPostsLikesInfo = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeQueryRepoEnum
    newestLikes: INewestLikes[]
}

export {
    PostsOutputType, PostsQueryRepo, IExtendedPost
};
