import {dbCollections} from "../server/db/conn";
import {refreshTokenSecret} from "../services/users-service";


const usersRepository = {
    async createUser(newUser: UserDdType): Promise<boolean> {
        const result = await dbCollections.users.insertOne(newUser)
        return result.acknowledged;
    },
    async deleteAllUser(): Promise<boolean> {
        const result = await dbCollections.users.deleteMany({})
        return result.deletedCount >= 0;
    },
    async findUserById(id: string,): Promise<UserDdType | null> {
        const result = await dbCollections.users.findOne({"accountData.id": id}, {projection: {_id: 0}});
        return result;
    },
    async findUserByEmail(email: string,): Promise<UserDdType | null> {
        const result = await dbCollections.users.findOne(
            {"accountData.email": email}, {projection: {_id: 0}});
        return result;
    },
    async findUserByConfirmationCode(code: string,): Promise<UserDdType | null> {
        const result = await dbCollections.users.findOne(
            {"emailConfirmation.confirmationCode": code}, {projection: {_id: 0}});
        return result;
    },
    async findUserByLogin(login: string,): Promise<UserDdType | null> {
        const result = await dbCollections.users.findOne({
            "accountData.login": login
        }, {projection: {_id: 0}});
        return result;
    },
    async confirmUser(id: string,): Promise<boolean> {
        const result = await dbCollections.users.updateOne({"accountData.id": id}, {
            $set: {
                "emailConfirmation.isConfirmed": true
            }
        })
        return result.modifiedCount === 1;
    },
    async updateConfirmationCode(id: string, emailConfirmation: emailConfirmationType): Promise<boolean> {
        const result = await dbCollections.users.updateOne({"accountData.id": id}, {
            $set: {
                "emailConfirmation": emailConfirmation
            }
        })
        return result.modifiedCount === 1;
    },
    async deleteUserById(id: string): Promise<boolean> {
        const result = await dbCollections.users.deleteOne({"accountData.id": id})
        return result.deletedCount === 1
    },
    async revokeRefreshToken(id: string,  refreshToken:string ): Promise<boolean> {
        const result = await dbCollections.users.updateOne({"accountData.id": id}, { $push: { "accountData.invalidRefreshTokens": refreshToken } });
        return result.modifiedCount === 1;
    },
};

export {usersRepository, UserDdType, UserType, emailConfirmationType}


type UserType = {
    id: string
    login: string
    email: string
    createdAt: string
}
type emailConfirmationType ={
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}
type UserDdType = {
    accountData: {
        id: string
        login: string
        email: string
        hash: string
        createdAt: string
        invalidRefreshTokens: string[]
    },
    emailConfirmation: emailConfirmationType
}