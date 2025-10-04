import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: subscription,
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
