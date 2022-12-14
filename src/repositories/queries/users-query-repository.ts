import {dbCollections} from "../../server/db/conn";
import {sortDirectionEnum, sortDirectionType} from "./blogs-query-repository";
import {UserType} from "../users-db-repository";

const filterParam = (searchLoginTerm: string | null, searchEmailTerm: string | null,) => {
    let param;
    if (searchLoginTerm && searchEmailTerm) {
        param = {
            $or: [
                {"accountData.login": {$regex: searchLoginTerm, '$options': 'i'}},
                {"accountData.email": {$regex: searchEmailTerm, '$options': 'i'}}
            ]
        }
    } else if (searchLoginTerm && !searchEmailTerm) {
        param = {"accountData.login": {$regex: searchLoginTerm, '$options': 'i'}}
    } else if (!searchLoginTerm && searchEmailTerm) {
        param = {"accountData.email": {$regex: searchEmailTerm, '$options': 'i'}}
    } else {
        param = {}
    }
    return param
}

const usersQueryRepository = {
    async getAllUser(pageNumber: number, pageSize: number, sortBy: string, sortDirection: sortDirectionType, searchLoginTerm: string | null, searchEmailTerm: string | null,): Promise<UsersOutputType> {
        const filter = filterParam(searchLoginTerm, searchEmailTerm)
        const totalCount: number = await dbCollections.users.find(filter, {projection: {_id: 0}}).count()
        const pagesCount: number = Math.ceil(totalCount / pageSize);
        const sortDirectionParam = sortDirection === sortDirectionEnum.asc ? 1 : -1;
        const skipItems: number = (pageNumber - 1) * pageSize;
        const users = await dbCollections.users.find(filter, {projection: {_id: 0, hash: 0}})
            .sort(`accountData.${sortBy}`, sortDirectionParam)
            .skip(skipItems)
            .limit(pageSize).toArray();
        const UsersOutput = {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: users.map(u => ({
                id: u.accountData.id,
                login: u.accountData.login,
                email: u.accountData.email,
                createdAt: u.accountData.createdAt,
            }))
        }
        return UsersOutput;
    },
    async deleteAllUser(): Promise<boolean> {
        const result = await dbCollections.users.deleteMany({})
        return result.deletedCount >= 0;
    },
};

type UsersOutputType = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": UserType[]
}

export {
    usersQueryRepository, UsersOutputType
}