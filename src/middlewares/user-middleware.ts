import {body, CustomValidator} from "express-validator";
import { myContainer } from "../inversify.config";
import {UserDdType} from "../repositories/users-db-repository";
import { UsersService } from "../services/users-service";

const usersService = myContainer.get<UsersService>(UsersService);


const isEmailUnique: CustomValidator = async (value) => {
    const user: UserDdType | null = await usersService.findUserByEmail(value.toLowerCase());
    if (user === null) {
        return true;
    } else {
        return Promise.reject('we already have a user with this email, please use a different email ');
    }
};

const isLoginUnique: CustomValidator = async (value) => {
    const user: UserDdType | null = await usersService.findUserByLogin(value);
    if (user === null) {
        return true;
    } else {
        return Promise.reject('we already have a user with this login, please use a different login ');
    }
};
const loginValidation = body("login")
    .isString().withMessage(`login should be string`)
    .trim().withMessage(`login should be symbols string`)
    .notEmpty().withMessage(`login  is required`)
    .isLength({min: 3, max: 10}).withMessage(`length is 10 max and 3 min`)
    .custom(isLoginUnique);

const emailValidator = body("email")
    .isString().withMessage(`email should be string`)
    .trim().withMessage(`email should be symbols string`)
    .notEmpty().withMessage(`email  is required`)
    .isEmail().withMessage("email be email format")
    .custom(isEmailUnique);

const passwordValidator = body("newPassword")
    .isString().withMessage(`newPassword should be string`)
    .trim().withMessage(`newPassword should be symbols string`)
    .notEmpty().withMessage(`newPassword  is required`)
    .isLength({min: 6, max: 20}).withMessage(`length is 20 max and 6 min`)

const recoveryCodeValidator = body("recoveryCode")
    .isString().withMessage(`recoveryCode should be string`)
    .trim().withMessage(`recoveryCode should be symbols string`)
    .notEmpty().withMessage(`recoveryCode  is required`)

const emailSimpleValidator = body("email")
    .isString().withMessage(`email should be string`)
    .trim().withMessage(`email should be symbols string`)
    .notEmpty().withMessage(`email  is required`)
    .isEmail().withMessage("email be email format");

const confirmationCodeValidation = body("code")
    .isString().withMessage(`code should be string`)
    .trim().withMessage(`code should be symbols string`)
    .notEmpty().withMessage(`code is required`)

const loginOrEmailRequired = body("loginOrEmail")
    .isString().withMessage(`loginOrEmail should be string`)
    .trim().withMessage(`loginOrEmail should be symbols string`)
    .notEmpty().withMessage(`loginOrEmail is required`)

const deviceIdRequired = body("deviceId")
    .isString().withMessage(`deviceId should be string`)
    .trim().withMessage(`deviceId should be symbols string`)
    .notEmpty().withMessage(`deviceId is required`)

const passwordValidation = body("password")
    .isString().withMessage(`password should be string`)
    .trim().withMessage(`password should be symbols string`)
    .notEmpty().withMessage(`password  is required`)
    .isLength({min: 6, max: 20}).withMessage(`length is 20 max and 6 min`);

const emailRequired = body("email")
    .isString().withMessage(`email should be string`)
    .trim().withMessage(`email should be symbols string`)
    .notEmpty().withMessage(`email  is required`)
    .isEmail().withMessage("email be email format")

const loginRequired = body("login")
    .isString().withMessage(`login should be string`)
    .trim().withMessage(`login should be symbols string`)
    .notEmpty().withMessage(`login  is required`)
    .isLength({min: 3, max: 10}).withMessage(`length is 10 max and 3 min`)

export {
    loginValidation,
    emailValidator,
    passwordValidation,
    confirmationCodeValidation,
    emailRequired,
    loginRequired,
    loginOrEmailRequired,
    emailSimpleValidator,
    passwordValidator, recoveryCodeValidator,
}