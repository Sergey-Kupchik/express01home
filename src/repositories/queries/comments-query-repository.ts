import {Blog, Comment, dbCollections} from "../../server/db/conn";
import {CommentOutputType, CommentType} from "../../services/coments-service";
import {sortDirectionEnum, sortDirectionType} from "./blogs-query-repository";


const commentsQueryRepository = {
    async getCommentById(commentId: string): Promise<CommentType | null> {
        // const result = await dbCollections.comments.findOne({id:commentId}, {projection: {_id: 0}})
        const comment = await Comment.findOne({id:commentId},'-_id  -__v').lean()
        return comment;
    },
    async getComments4Post(pageNumber: number, pageSize: number, sortBy: string, sortDirection: sortDirectionType, postId: string): Promise<CommentGroupType> {
        const filterParam = {postId}
        // const totalCount: number = await dbCollections.comments.find(filterParam, {projection: {_id: 0}}).count()
        const totalCount: number = await Comment.find(filterParam).count()
        const pagesCount: number = Math.ceil(totalCount / pageSize);
        const sortDirectionParam = sortDirection === sortDirectionEnum.asc ? 1 : -1;
        const skipItems: number = (pageNumber - 1) * pageSize;
        // const comments = await dbCollections.comments.find(filterParam, {projection: {_id: 0, postId: 0}})
        //     .sort(sortBy, sortDirectionParam)
        //     .skip(skipItems)
        //     .limit(pageSize).toArray()
        const comments = await Comment.find(filterParam, '-_id  -__v')
            .sort({sortBy: sortDirectionParam})
            .skip(skipItems)
            .limit(pageSize).lean()
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
        // const result = await dbCollections.comments.deleteOne({id})
        // return result.deletedCount === 1
        const result = await Comment.deleteOne({"id": id});
        return result.deletedCount === 1
    },
    async deleteAllComments(): Promise<boolean> {
        const result = await Comment.deleteMany({})
        return result.acknowledged;
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