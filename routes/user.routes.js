import { Router } from "express";
import { getAllUsers, getUser } from "../controllers/user.controller.js";
import authorize from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);

userRouter.get("/:id",authorize ,getUser);

userRouter.post("/", (req, res) => {
  res.send({ title: "create a user" });
});

userRouter.put("/:id", (req, res) => {
  res.send({ title: "update a user" });
});

userRouter.delete("/:id", (req, res) => {
  res.send({ title: "delete a user" });
});

export default userRouter;