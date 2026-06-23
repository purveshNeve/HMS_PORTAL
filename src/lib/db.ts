import mongoose from "mongoose";
let cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = (global as any).mongoose || {
  conn: null,
  promise: null,
};
export async function dbConnect() {
  const MONGO_URL = process.env.MONGODB_URI!;
  console.log("MONGO_URL =", MONGO_URL);
  if (!MONGO_URL) {
    throw new Error("MONGODB_URI is not defined");
  }
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL);
  }
  cached.conn = await cached.promise;
  (global as any).mongoose = cached;
  return cached.conn;
}