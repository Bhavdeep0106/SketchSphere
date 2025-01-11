import express from "express";
import  Jwt  from "jsonwebtoken";
import { JWT_PASSWORD } from '@repo/backend-common/config';
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types"
const app = express();

app.post("/signup", async (req, res) => {
    // db call
    const data = CreateUserSchema.safeParse(req.body);
    if (!data.success){
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    res.json({
        userId: "123",
    })
});

app.post("/signin", async (req, res) => {
    const data = SigninSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    const userId = 1;
    const token = Jwt.sign({
        userId
    }, JWT_PASSWORD);

    res.json({
        token
    })
});

app.post("/room", middleware, (req,res) =>{
    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success){
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    //db call
    res.json({
        roomId: "123"
    })
})