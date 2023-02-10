import {User} from "../server/db/conn";

class UsersRepo {
    async createUser(newUser: UserDdType): Promise<boolean> {
        const user = new User(newUser);
        const savedDoc = await user.save();
        return savedDoc.accountData.id === newUser.accountData.id;
    }
    async findUserById(id: string,): Promise<UserDdType | null> {
        const result = await User.findOne({"accountData.id": id}, '-_id  -__v').lean()
        return result;
    }
    async findUserByEmail(email: string,): Promise<UserDdType | null> {
        const result = await User.findOne({"accountData.email": email}, '-_id  -__v').lean()
        return result;
    }
    async findUserByConfirmationCode(code: string,): Promise<UserDdType | null> {
        const result = await User.findOne({"emailConfirmation.confirmationCode": code}, '-_id  -__v').lean();
        return result
    }
    async findUserByPasswordRecoveryHashCode(hash: string,): Promise<UserDdType | null> {
        const result = await User.findOne({"accountData.resetPasswordHash": hash}, '-_id  -__v').lean();
        return result
    }
    async findUserByLogin(login: string,): Promise<UserDdType | null> {
        const result = User.findOne({"accountData.login": login}, '-_id  -__v').lean();
        return result;
    }
    async confirmUser(id: string,): Promise<boolean> {
        const user = await User.findOneAndUpdate({"accountData.id": id}, {"emailConfirmation.isConfirmed": true}, {new: true});
        return user!.emailConfirmation.isConfirmed;
    }
    async updateConfirmationCode(id: string, emailConfirmation: emailConfirmationType): Promise<boolean> {
        await User.findOneAndUpdate({"accountData.id": id}, {"emailConfirmation": emailConfirmation}, {new: true});
        return true;
    }
    async deleteUserById(id: string): Promise<boolean> {
        const result = await User.deleteOne({"accountData.id": id});
        return result.deletedCount === 1
    }
    async revokeRefreshToken(id: string, refreshToken: string): Promise<boolean> {
        await User.findOneAndUpdate({"accountData.id": id}, {$push: {"accountData.invalidRefreshTokens": refreshToken}}, {new: true});
        return true;
    }
    async addResetPasswordHash(id: string, resetPasswordHash: string,): Promise<boolean> {
        const user = await User.findOneAndUpdate({"accountData.id": id}, {
            "accountData.resetPasswordHash": resetPasswordHash,
        }, {new: true});
        return true;
    }
    async passwordHashChange(id: string,newPasswordHash: string,): Promise<boolean> {
        const user = await User.findOneAndUpdate({"accountData.id": id}, {"accountData.hash": newPasswordHash}, {new: true});
        return true;
    }
    async deleteResetPasswordHashByUserId(id: string,): Promise<boolean> {
        const userInstance = await User.findOne({"accountData.id": id});
        if (!userInstance) return false
        userInstance.resetPasswordHash =undefined;
        await userInstance.save()
        return true;
    }

}


export { UsersRepo, UserDdType, UserType,UserHashInfoType, emailConfirmationType}


type UserType = {
    id: string
    login: string
    email: string
    createdAt: string
}
type UserHashInfoType = {
    id: string
    login: string
    email: string
    createdAt: string
    resetPasswordHash: string,
    resetPasswordExpires: Date
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
        resetPasswordHash?: string
        resetPasswordExpires?: Date
    },
    emailConfirmation: emailConfirmationType,
}
