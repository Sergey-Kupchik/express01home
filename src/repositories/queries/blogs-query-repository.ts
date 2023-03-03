import { injectable } from "inversify";
import { Blog } from "../../server/db/conn";
import { BlogType } from "../../services/blogs-service";

@injectable()
class BlogsQueryRepository {
    async getAllBlogs(): Promise<BlogType[]> {
        const blogs = await Blog.find({}, '-_id  -__v').lean()
        return blogs;
    }

    async getBlogById(id: string): Promise<BlogType | null> {
        const blog = await Blog.findOne({"id": id}, '-_id  -__v').lean()
        return blog;
    }

    async getFilteredBlogs(searchNameTerm: string | null, pageNumber: number, pageSize: number, sortBy: string, sortDirection: sortDirectionType): Promise<BlogOutputType> {
        const filterParam = searchNameTerm ? ({"name": {$regex: searchNameTerm, '$options': 'i'}}) : {}
        const totalCount: number = await Blog.find(filterParam).count()
        const pagesCount: number = Math.ceil(totalCount / pageSize);
        const sortDirectionParam = sortDirection === sortDirectionEnum.asc ? 1 : -1;
        const skipItems: number = (pageNumber - 1) * pageSize;
        const blogs: BlogType[] = await Blog.find(filterParam, '-_id  -__v')
            .sort({sortBy: sortDirectionParam})
            .skip(skipItems)
            .limit(pageSize)
        const BlogOutput = {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: blogs
        }
        return BlogOutput;
    }
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
        websiteUrl: string
        createdAt: string
    }>
}
export {
    BlogOutputType, sortDirectionType, sortDirectionEnum, BlogsQueryRepository
};



