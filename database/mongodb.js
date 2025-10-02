import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

if(!DB_URI){
    throw new Error("Database connection string is not defined");
}

const connectToDb = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to the database successfully");
    } catch (error) {
        console.error("Error connecting to the database", error);
        process.exit(1);
    }
};

export default connectToDb;