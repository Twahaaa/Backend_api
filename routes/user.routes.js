import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.send({ title: "get all users" });
});

userRouter.get("/:id", (req, res) => {
  res.send({ title: "get all users" });
});

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