import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "@repo/backend-common/config";

export function middleware(req: Request,res: Response, next: NextFunction){
    const token = req.headers["authorization"] ?? "";

    const decoded =jwt.verify(token, JWT_PASSWORD);

    if(decoded) {
        //@ts-ignore: will fix
        req.userId =decoded.userId;
        next();
    }else {
        res.status(403).json({
            message: "Unauthorized"
        })
    }
}