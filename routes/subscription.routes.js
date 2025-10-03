import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import { createSubscription } from "../controllers/subsription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/",(req, res) => {
    res.send({ title: "get all subscriptions" });
});

subscriptionRouter.get("/:id", (req, res) => {
    res.send({ title: "get a subscription by id" });
});

subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.put("/:id", (req, res) => {
    res.send({ title: "update a subscription by id" });
});

subscriptionRouter.delete("/:id", (req, res) => {
    res.send({ title: "delete a subscription by id" });
});

subscriptionRouter.get("/user/:id",(req, res) => {
    res.send({ title: "get all user subscriptions" });
});

subscriptionRouter.put("/:id/cancel", (req, res) => {
    res.send({ title: "cancel a subscription" });
});

subscriptionRouter.get("/upcoming-renewals",(req, res) => {
    res.send({ title: "get upcoming renewals" });
});

export default subscriptionRouter;