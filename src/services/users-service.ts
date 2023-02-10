import bcrypt from "bcrypt";
import {currentDate, validateEmail} from "../utils/utils";
import {UserDdType, UserHashInfoType, UsersRepo, UserType} from "../repositories/users-db-repository";
import {v4 as uuidv4} from "uuid";
import {accessTokenSecret, TokensService} from "./tokens-service";
import add from 'date-fns/add';
import {RefreshTokensRepo} from "../repositories/refresh-token-repository";

class UsersServ {
    private usersRepository: UsersRepo;
    private tokensService: TokensService;
    private refreshTokensRepo: RefreshTokensRepo;
    constructor() {
        this.usersRepository = new UsersRepo();
        this.tokensService = new TokensService();
        this.refreshTokensRepo = new RefreshTokensRepo();
    }
    async createUser(login: string, email: string, password: string): Promise<UserType | null> {
        const newUser: UserDdType = {
            accountData: {
                id: uuidv4(),
                login,
                email: email.toLowerCase(),
                hash: await this._hashPassword(password),
                createdAt: currentDate(),
                invalidRefreshTokens: []
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date, {
                    hours: 5,
                }),
                isConfirmed: false
            }
        }
        await this.usersRepository.createUser(newUser);
        const user = await this.findUserById(newUser.accountData.id)
        return user
    }
    async _hashPassword(password: string): Promise<string> {
        const hash = await bcrypt.hash(password, 10);
        return hash
    }
    async _compareHashAndPassword(password: string, hash: string): Promise<boolean> {
        const isPasswordValid = await bcrypt.compare(password, hash);
        return isPasswordValid;
    }
    async findUserById(id: string,): Promise<UserType | null> {
        const result = await this.usersRepository.findUserById(id);
        if (result) {
            const User: UserType = {
                id: result.accountData.id,
                login: result.accountData.login,
                email: result.accountData.email,
                createdAt: result.accountData.createdAt,
            }
            return User;
        } else {
            return result;
        }
    }
    async findUserByPasswordRecoveryHashCode(hash: string,): Promise<UserHashInfoType | null> {
        const result = await this.usersRepository.findUserByPasswordRecoveryHashCode(hash);
        if (result && result.accountData.resetPasswordHash && result.accountData.resetPasswordExpires) {
            const User: UserHashInfoType = {
                id: result.accountData.id,
                login: result.accountData.login,
                email: result.accountData.email,
                createdAt: result.accountData.createdAt,
                resetPasswordHash: result.accountData.resetPasswordHash,
                resetPasswordExpires: result.accountData.resetPasswordExpires,
            }
            return User;
        } else {
            return null;
        }
    }
    async checkCredentials(loginOrEmail: string, password: string, clientIp: string, deviceTitle: string): Promise<TokensType | null> {
        let user = validateEmail(loginOrEmail) ? await this.findUserByEmail(loginOrEmail) : await this.findUserByLogin(loginOrEmail);
        if (user) {
            const isPasswordValid = await this._compareHashAndPassword(password, user.accountData.hash)
            if (isPasswordValid) {
                const accessToken = await this.tokensService.createAccessToken(user.accountData.id,);
                const refreshToken = await this.tokensService.createRefreshToken(user.accountData.id, clientIp, deviceTitle);
                return {
                    accessToken,
                    refreshToken,
                }
            }
            return null
        }
        return null
    }
    async findUserByEmail(email: string,): Promise<UserDdType | null> {
        const user = await this.usersRepository.findUserByEmail(email.toLowerCase());
        return user
    }
    async findUserByConfirmationCode(code: string,): Promise<UserDdType | null> {
        const user = await this.usersRepository.findUserByConfirmationCode(code);
        return user
    }
    async findUserByLogin(login: string,): Promise<UserDdType | null> {
        const user = await this.usersRepository.findUserByLogin(login);
        return user
    }
    async deleteUserById(id: string,): Promise<boolean> {
        const result = await this.usersRepository.deleteUserById(id);
        return result
    }
    async confirmUser(id: string,): Promise<boolean> {
        const idConfirmed: boolean = await this.usersRepository.confirmUser(id);
        return idConfirmed
    }
    async updateConfirmationCode(id: string,): Promise<string | null> {
        const emailConfirmation = {
            confirmationCode: uuidv4(),
            expirationDate: add(new Date, {
                hours: 5,
            }),
            isConfirmed: false
        }
        const idUpdated: boolean = await this.usersRepository.updateConfirmationCode(id, emailConfirmation);
        if (idUpdated) return emailConfirmation.confirmationCode
        return null
    }
    async revokeRefreshToken(id: string, refreshToken: string): Promise<boolean> {
        const result = await this.usersRepository.revokeRefreshToken(id, refreshToken);
        return result
    }
    async refreshTokens(id: string, oldToken: string, deviceId: string, clientIp: string): Promise<TokensType> {
        const accessToken = await this.tokensService.createAccessToken(id);
        const refreshToken = await this.tokensService.updateRefreshToken(id, deviceId, clientIp);
        await this.revokeRefreshToken(id, oldToken)
        return {
            accessToken,
            refreshToken,
        }
    }
    async addResetPasswordByEmail(email: string, recoverCode: string,): Promise<boolean> {
        const user = await this.findUserByEmail(email)
        if (!user) return false
        const resetPasswordHash = await this._hashPassword(recoverCode);
        await this.usersRepository.addResetPasswordHash(user.accountData.id, resetPasswordHash,)
        return true;
    }
    async createNewPassword(newPassword: string, recoveryCode: string): Promise<boolean> {
        const email = await this.getEmailFromRecoveryCode(recoveryCode)
        if (!email) return false
        const user = await this.findUserByEmail(email)
        if (!user) return false
        if (user.accountData.resetPasswordHash === undefined)  return false
        const isRecoveryCodeValid = await this._compareHashAndPassword(recoveryCode, user.accountData.resetPasswordHash)
        if (!isRecoveryCodeValid) return false
        const newPasswordHash = await this._hashPassword(newPassword);
        const passwordHasBeenChanged: Boolean = await this.usersRepository.passwordHashChange(user.accountData.id, newPasswordHash)
        if (!passwordHasBeenChanged) return false;
        await this.refreshTokensRepo.deleteAllTokensByUserId(user.accountData.id)
        await this.usersRepository.deleteResetPasswordHashByUserId(user.accountData.id)
        return true
    }
    async getEmailFromRecoveryCode(recoveryCode: string): Promise<string | null> {
        const tokenPayload = await this.tokensService.verifyToken(recoveryCode, accessTokenSecret);
        if (tokenPayload?.email) return tokenPayload.email
        return null
    }
}


export { UsersServ}


type TokensType = {
    accessToken: string
    refreshToken: string
}