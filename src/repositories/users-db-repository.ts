import {dbCollections} from "../server/db/conn";

type UserType = {
    id: string
    login: string
    email: string
    createdAt: string
}
type UserDdType = UserType & { hash: string }

const usersRepository = {
    async createUser(newUser: UserDdType): Promise<boolean> {
        const result = await dbCollections.users.insertOne(newUser)
        debugger
        return result.acknowledged;
    },
    async deleteAllUser(): Promise<boolean> {
        const result = await dbCollections.users.deleteMany({})
        return result.deletedCount >= 0;
    },
    async findUserById(id: string,): Promise<UserDdType | null> {
        const result = await dbCollections.users.findOne({id}, {projection: {_id: 0}});
        return result;
    },
    async findUserByEmail(email: string,): Promise<UserDdType | null> {
        const result = await dbCollections.users.findOne({
            email: {
                $regex: email,
                '$options': 'i'
            }
        }, {projection: {_id: 0}});
        return result;
    },
    async findUserByLogin(login: string,): Promise<UserDdType | null> {
        const result = await dbCollections.users.findOne({
            login: {
                $regex: login,
                '$options': 'i'
            }
        }, {projection: {_id: 0}});
        return result;
    },
    async deleteUserById(id: string): Promise<boolean> {
        const result = await dbCollections.users.deleteOne({id})
        return result.deletedCount === 1
    },
};

export {usersRepository, UserDdType, UserType}