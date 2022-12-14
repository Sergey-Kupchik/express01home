import {BlogType} from "../../services/blogs-service";
import {dbCollections} from "../../server/db/conn";
import {CommentOutputType, CommentType} from "../../services/coments-service";
import {sortDirectionEnum, sortDirectionType} from "./blogs-query-repository";


const commentsQueryRepository = {
    async getCommentById(commentId: string): Promise<CommentType | null> {
        const result = await dbCollections.comments.findOne({id:commentId}, {projection: {_id: 0}})
        return result;
    },
    async getComments4Post(pageNumber: number, pageSize: number, sortBy: string, sortDirection: sortDirectionType, postId: string): Promise<CommentGroupType> {
        const filterParam = {postId}
        const totalCount: number = await dbCollections.comments.find(filterParam, {projection: {_id: 0}}).count()
        const pagesCount: number = Math.ceil(totalCount / pageSize);
        const sortDirectionParam = sortDirection === sortDirectionEnum.asc ? 1 : -1;
        const skipItems: number = (pageNumber - 1) * pageSize;
        const comments = await dbCollections.comments.find(filterParam, {projection: {_id: 0, postId: 0}})
            .sort(sortBy, sortDirectionParam)
            .skip(skipItems)
            .limit(pageSize).toArray()
        const comments4Return: CommentGroupType = {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: comments
        }
        return comments4Return;
    },
    async deleteCommentById(id: string): Promise<boolean> {
        const result = await dbCollections.comments.deleteOne({id})
        return result.deletedCount === 1
    },
    async deleteAllComments(): Promise<boolean> {
        const result = await dbCollections.comments.deleteMany({})
        return result.deletedCount >= 0
    },
};


type CommentGroupType = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": Array<CommentOutputType>
}

export {
    commentsQueryRepository, CommentGroupType
}