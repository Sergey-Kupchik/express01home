import bcrypt from "bcrypt";
import {currentDate, validateEmail} from "../utils/utils";
import {UserDdType, usersRepository, UserType} from "../repositories/users-db-repository";
import {v4 as uuidv4} from "uuid";
import {tokensService} from "./tokens-service";
import add from 'date-fns/add';


const usersService = {
    async createUser(login: string, email: string, password: string): Promise<UserType | null> {
        const newUser: UserDdType = {
            accountData: {
                id: uuidv4(),
                login,
                email: email.toLowerCase(),
                hash: await this._hashPassword(password),
                createdAt: currentDate(),
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date, {
                    hours: 5,
                }),
                isConfirmed: false
            }
        }
        await usersRepository.createUser(newUser);
        const user = await this.findUserById(newUser.accountData.id)
        return user
    },
    async _hashPassword(password: string): Promise<string> {
        const hash = await bcrypt.hash(password, 10);
        return hash
    },
    async _comparePassword(password: string, hash: string): Promise<boolean> {
        const isPasswordValid = await bcrypt.compare(password, hash);
        return isPasswordValid;
    },
    async findUserById(id: string,): Promise<UserType | null> {
        const result = await usersRepository.findUserById(id);
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
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise<string | null> {
        let user = validateEmail(loginOrEmail) ? await this.findUserByEmail(loginOrEmail) : await this.findUserByLogin(loginOrEmail);
        if (user) {
            const isPasswordValid = await this._comparePassword(password, user.accountData.hash)
            if (isPasswordValid) {
                return await tokensService.createToken(user.accountData.id)
            }
            return null
        }
        return null
    },
    async findUserByEmail(email: string,): Promise<UserDdType | null> {
        const user = await usersRepository.findUserByEmail(email.toLowerCase());
        return user
    },
    async findUserByLogin(login: string,): Promise<UserDdType | null> {
        const user = await usersRepository.findUserByLogin(login);
        return user
    },
    async deleteUserById(id: string,): Promise<boolean> {
        const result = await usersRepository.deleteUserById(id);
        return result
    },
}


export {usersService}