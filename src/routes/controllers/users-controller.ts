import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { UsersOutputType, UsersQueryRepo } from "../../repositories/queries/users-query-repository";
import { UserType } from "../../repositories/users-db-repository";
import { UsersService } from "../../services/users-service";

@injectable()
export class UsersController {

    constructor(@inject(UsersService) protected usersService: UsersService, protected usersQueryRepository: UsersQueryRepo) {

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
            return res.sendStatus(404)

        }
        return res.sendStatus(204)

    }
}