import mongoose from "mongoose";
import UserModel from "./src/models/User";
import { dbConnect } from "./src/lib/db";
import { config } from "dotenv";
import bcrypt from "bcryptjs";

config({ path: ".env.local" });

async function emulateAuthorize() {
  const credentials = {
    userId: "1000",
    password: "password123",
    role: "EMPLOYEE",
  };

  try {
    console.log("========== EMULATING AUTHORIZE ==========");
    console.log("Received Credentials:", credentials);

    await dbConnect();
    console.log("Database:", mongoose.connection.name);
    console.log("Collections:", Object.keys(mongoose.connection.collections));

    // Exact query from auth.ts
    const user = await UserModel.findOne({
      userId: credentials.userId,
    });

    console.log("User Found:", user);

    if (!user) {
      console.log("❌ User not found");
      return null;
    }

    if (!user.password) {
      console.log("❌ Password missing in database");
      return null;
    }

    console.log("Database Role:", user.role);
    console.log("Login Role:", credentials.role);

    // Role validation (case-insensitive)
    if (
      String(user.role).toLowerCase() !==
      String(credentials.role).toLowerCase()
    ) {
      console.log("❌ Role mismatch");
      return null;
    }

    console.log("Comparing password...");
    // Let's print hash from DB and the input password
    console.log("Password hash in DB:", user.password);
    console.log("Input password:", credentials.password);
    
    const validPassword = await bcrypt.compare(
      credentials.password as string,
      user.password
    );

    console.log("Password Match:", validPassword);

    if (!validPassword) {
      console.log("❌ Invalid password");
      return null;
    }

    console.log("✅ Authentication Successful");
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      userId: user.userId,
      department: user.department,
    };
  } catch (error) {
    console.error("❌ Authorize Error:", error);
    return null;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

emulateAuthorize().catch(console.error);
