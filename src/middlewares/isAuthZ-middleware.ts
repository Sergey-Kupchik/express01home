import {NextFunction, Request, Response} from "express";

const isAuthZ = (req: Request, res: Response, next: NextFunction) => {
    const basicToken = req.headers["authorization"]
    if (basicToken === "Basic YWRtaW46cXdlcnR5") {
        next()
    } else {
        res.send(401)
    }
}

export {isAuthZ};