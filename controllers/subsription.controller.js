import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    // --- ADD THIS DEBUG LOG ---
    console.log("--- NEW SUBSCRIPTION SAVED ---");
    console.log("Status:", subscription.status);
    console.log("Start Date:", subscription.startDate);
    console.log("Renewal Date:", subscription.renewalDate);
    console.log("------------------------------");

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v-1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
    });

    res.status(201).json({
      success: true,
      data: { subscription, workflowRunId },
    });
  } catch (e) {
    next(e);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    //check if the usre is the same as the userId in params
    // console.log("req.user.id:",req.user.id);
    // console.log("req.params.userId:",req.params.id);
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const subscription = await Subscription.find({ user: req.params.id });

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (e) {
    next(e);
  }
};
