import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRY, JWT_SECRET } from "../config/env.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists with this email");
      error.statusCode = 409;
      throw error;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user using User.create()
    const newUsers = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    // Now, newUsers will be an array with one user in it, so newUsers[0] will work correctly.
    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: newUsers[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });

    res.status(200).json({
      success: true,
      message: "User signed in succesfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// export const signIn = async (req, res, next) => {
//   try {
//     console.log("1. Incoming request:", req.body);

//     const { email, password } = req.body;

//     console.log("2. Looking up user...");
//     const user = await User.findOne({ email });
//     console.log("3. User found:", user ? user._id : "none");

//     if (!user) {
//       return res.status(401).json({ success: false, message: "Invalid email or password" });
//     }

//     console.log("4. Comparing password...");
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     console.log("5. Password valid:", isPasswordValid);

//     if (!isPasswordValid) {
//       return res.status(401).json({ success: false, message: "Invalid email or password" });
//     }

//     console.log("6. Signing JWT...");
//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

//     console.log("7. Sending response...");
//     res.status(200).json({
//       success: true,
//       message: "User signed in successfully",
//       data: { token, user },
//     });
//   } catch (error) {
//     console.error("🔥 Error in signIn:", error);
//     next(error);
//   }
// };



// export const signOut = async (req, res, next) => {};
