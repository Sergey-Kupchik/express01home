import {Request} from "express";
import {UserDdType, UserType} from "../repositories/users-db-repository";

declare global{
    declare namespace Express {
        export interface Request {
            user:UserDdType|null
        }
    }
}


