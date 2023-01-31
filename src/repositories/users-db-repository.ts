import {User} from "../server/db/conn";

const usersRepository = {
    async createUser(newUser: UserDdType): Promise<boolean> {
        const user = new User(newUser);
        const savedDoc = await user.save();
        return savedDoc.accountData.id === newUser.accountData.id;
    },
    async findUserById(id: string,): Promise<UserDdType | null> {
        const result = await User.findOne({"accountData.id": id},'-_id  -__v').lean()
        return result;
    },
    async findUserByEmail(email: string,): Promise<UserDdType | null> {
        const result = await User.findOne({"accountData.email": email},'-_id  -__v').lean()
        return result;
    },
    async findUserByConfirmationCode(code: string,): Promise<UserDdType | null> {
        const result = await User.findOne({"emailConfirmation.confirmationCode": code}, '-_id  -__v').lean();
        return result
    },
    async findUserByLogin(login: string,): Promise<UserDdType | null> {
        const result = User.findOne({"accountData.login": login}, '-_id  -__v').lean();
        return result;
    },
    async confirmUser(id: string,): Promise<boolean> {
        const user = await User.findOneAndUpdate({"accountData.id": id}, {"emailConfirmation.isConfirmed": true}, {new: true});
        return user!.emailConfirmation.isConfirmed;
    },
    async updateConfirmationCode(id: string, emailConfirmation: emailConfirmationType): Promise<boolean> {
        await User.findOneAndUpdate({"accountData.id": id}, {"emailConfirmation": emailConfirmation}, {new: true});
        return true;
    },
    async deleteUserById(id: string): Promise<boolean> {
        const result = await User.deleteOne({"accountData.id": id});
        return result.deletedCount === 1
    },
    async revokeRefreshToken(id: string, refreshToken: string): Promise<boolean> {
        await User.findOneAndUpdate({"accountData.id": id}, {$push: {"accountData.invalidRefreshTokens": refreshToken}}, {new: true});
        return true;
    },
};

export {usersRepository, UserDdType, UserType, emailConfirmationType}


type UserType = {
    id: string
    login: string
    email: string
    createdAt: string
}
type emailConfirmationType = {
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
    emailConfirmation: emailConfirmationType,
}
