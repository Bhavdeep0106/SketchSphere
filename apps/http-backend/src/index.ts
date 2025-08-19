import bcrypt from "bcrypt";
import express from "express";
import Jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema, } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        res.json({
            message: "Incorrect inputs",
        });
        return;
    }
    try {
        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data.username,
                password: hashedPassword,
                name: parsedData.data.name,
            },
        });
        res.json({
            userId: user.id,
        });
    } catch (e) {
        res.status(411).json({
            message: "user already exists with the same username",
        });
    }
});

app.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.username,
    }
  })

  if (!user || !(await bcrypt.compare(parsedData.data.password, user.password))) {
    res.status(403).json({
      message: "Not authorized"
    })
    return;
  }

  const token = Jwt.sign(
    {
      userId: user?.id
    },JWT_PASSWORD);

  res.json({
    token,
  });
});

app.post("/room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  const userId = req.userId;
  if (!userId) {
    res.status(400).json({
      message: "User ID is missing"
    });
    return;
  }
  try{
  const room =await prismaClient.room.create({
    data: {
      slug: parsedData.data.name,
      adminId: userId as string
    }
  })

  res.json({
    roomId: room.id
  });    
  }catch(e){
    res.status(411).json({
      message: "Room already exists with this specific username"
    })
  }

});
app.listen(3000);
