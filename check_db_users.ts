import mongoose from "mongoose";
import User from "./src/models/User";
import { dbConnect } from "./src/lib/db";
import { config } from "dotenv";

config({ path: ".env.local" });

async function listUsers() {
  try {
    console.log("Connecting...");
    await dbConnect();
    console.log("Connected database:", mongoose.connection.name);
    console.log("Collections:", Object.keys(mongoose.connection.collections));
    
    const users = await User.find({}).lean();
    console.log(`Found ${users.length} users:`);
    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

listUsers();
