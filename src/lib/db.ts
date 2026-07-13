import mongoose from "mongoose";
let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}
export async function dbConnect() {
  const MONGO_URL = process.env.MONGODB_URI;
  if (!MONGO_URL) {
    throw new Error("MONGODB_URI is not defined");
  }
  if (cached.conn){
    return cached.conn;
  }
  if (!cached.promise) {
    console.log("🔄 Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGO_URL, {
      bufferCommands: false,
      dbName: "HRMS_Portal",
      retryWrites: true,
      w: "majority",
    });
  }
  cached.conn = await cached.promise;
  console.log("✅ MongoDB Connected");
  return cached.conn;
}