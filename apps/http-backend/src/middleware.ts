import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "@repo/backend-common/config";

// Define the expected JWT payload type
interface JwtPayload {
    userId: string;
    // add other properties if needed
}

export function middleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
         res.status(403).json({ message: "Unauthorized" });
        return;
    }

    const token = authHeader.replace(/^Bearer\s+/i, "");

    try {
        const decoded = jwt.verify(token, JWT_PASSWORD) as JwtPayload;
        if (decoded && decoded.userId) {
            req.userId = decoded.userId;
            next();
        } else {
            res.status(403).json({ message: "Unauthorized" });
        }
    } catch (err) {
        res.status(403).json({ message: "Unauthorized" });
    }
}