import mongoose from "mongoose";
import User from "./src/models/User";
import { dbConnect } from "./src/lib/db";
import { config } from "dotenv";
config({ path: ".env.local" });

async function checkRecs() {
    await dbConnect();
    const users = await User.find({ "managerRecommendations.0": { $exists: true } }).lean();
    console.log("Users with recommendations:", JSON.stringify(users, null, 2));
    mongoose.disconnect();
}
checkRecs();
