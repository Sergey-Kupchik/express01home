import {Request, Response, Router} from 'express';
import {UsersServ} from "../services/users-service";
import {UsersOutputType, UsersQueryRepo} from "../repositories/queries/users-query-repository";
import {isAuthT} from "../middlewares/isAuth-middleware";
import {inputValidationMiddleware} from "../middlewares/validation-middleware";
import {emailValidator, loginValidation, passwordValidation} from "../middlewares/user-middleware";
import {UserType} from "../repositories/users-db-repository";


const usersRouter = Router();

class UsersRouter {
    private usersService: UsersServ;
    private usersQueryRepository: UsersQueryRepo;

    constructor() {
        this.usersService = new UsersServ()
        this.usersQueryRepository = new UsersQueryRepo()
    }

    async createUser(req: Request, res: Response) {
        const result: UserType | null = await this.usersService.createUser(req.body.login, req.body.email, req.body.password)
        if (!result) {
            return res.sendStatus(401)
        }
        return res.status(201).send(result)
    }

    async getAllUser(req: Request, res: Response) {
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : "createdAt";
        const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : "desc";
        const searchLoginTerm = req.query.searchLoginTerm ? req.query.searchLoginTerm.toString() : null;
        const searchEmailTerm = req.query.searchEmailTerm ? req.query.searchEmailTerm.toString().toLowerCase() : null;
        const users: UsersOutputType = await this.usersQueryRepository.getAllUser(pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm)
        return res.send(users)
    }

    async deleteUserById(req: Request, res: Response) {
        const isDeleted: boolean = await this.usersService.deleteUserById(req.params.id,)
        if (!isDeleted) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
        return
    }
}

const users = new UsersRouter()

usersRouter.post('/',
    isAuthT,
    loginValidation,
    emailValidator,
    passwordValidation,
    inputValidationMiddleware, users.createUser.bind(users));

usersRouter.get('/',
    isAuthT,
    inputValidationMiddleware,
    inputValidationMiddleware, users.getAllUser.bind(users));

usersRouter.delete('/:id',
    isAuthT,
    inputValidationMiddleware,
    inputValidationMiddleware, users.deleteUserById.bind(users));

export {
    usersRouter
}