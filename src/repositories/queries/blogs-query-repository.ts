import {dbCollections} from "../../server/db/conn";
import {BlogType} from "../../services/blogs-service";


const blogsQueryRepository = {
    async getAllBlogs(): Promise<BlogType[]> {
        const blogs = await dbCollections.blogs.find({}, {projection: {_id: 0}}).toArray()
        return blogs;
    },
    async getBlogById(id: string): Promise<BlogType | null> {
        const result = await dbCollections.blogs.findOne({id}, {projection: {_id: 0}})
        return result;
    },
    async getFilteredBlogs(searchNameTerm: string| null, pageNumber: number, pageSize: number, sortBy: string, sortDirection: sortDirectionType): Promise<BlogOutputType> {
        const filterParam = searchNameTerm?({"name" : { $regex: searchNameTerm, '$options' : 'i'} }):{}
        const totalCount: number = await dbCollections.blogs.find(filterParam).count()

        const pagesCount: number = Math.ceil(totalCount / pageSize);
        const sortDirectionParam = sortDirection === sortDirectionEnum.asc ? 1 : -1;
        const skipItems: number = (pageNumber - 1) * pageSize;
        const blogs: BlogType[] = await dbCollections.blogs.find(filterParam, {projection: {_id: 0}})
            .sort(sortBy,sortDirectionParam)
            .skip(skipItems)
            .limit(pageSize).toArray()
        const BlogOutput = {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: blogs
        }
        return BlogOutput;
    },
}

enum sortDirectionEnum {
    asc = 'asc',
    desc = 'desc'
}

type sortDirectionType = 'asc' | 'desc' | string;

type BlogOutputType = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": Array<{
        id: string
        name: string
        youtubeUrl: string
        createdAt: string
    }>
}
export {
    blogsQueryRepository, BlogOutputType, sortDirectionType, sortDirectionEnum
}



