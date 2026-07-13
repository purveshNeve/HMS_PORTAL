import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import type { JWT } from "@auth/core/jwt";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import UserModel from "@/models/User";
import { dbConnect } from "./db";
import { sendIncorrectPasswordAlertEmail } from "@/lib/mail";
import type { UserRole } from "@/types";

declare module "next-auth" {
  interface User {
    id: string;
    role?: UserRole;
    userId?: string;
    department?: string;
  }

  interface Session {
    user: {
      id: string;
      userId: string;
      email: string;
      name: string;
      role: UserRole;
      department?: string;
      image?: string | null;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    userId?: string;
    department?: string;
  }
}

export const authConfig: NextAuthConfig = {
  debug: true,

  providers: [
    Credentials({
      name: "credentials",

      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userId: { label: "User ID", type: "text" },
        role: { label: "Role", type: "text" },
        department: { label: "Department", type: "text" },
      },

      async authorize(credentials) {
        try {
          console.log("========== LOGIN ATTEMPT ==========");
          console.log("Received Credentials:", credentials);

          await dbConnect();
          console.log("Database:", mongoose.connection.name);
          // Check required fields
          if (
            !credentials?.userId ||
            !credentials?.password ||
            !credentials?.role
          ) {
            console.log("❌ Missing required credentials");
            return null;
          }

          // Search only by userId
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

          const validPassword = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          console.log("Password Match:", validPassword);

          if (!validPassword) {
            console.log("❌ Invalid password");

            try {
              await sendIncorrectPasswordAlertEmail(
                user.email,
                user.name
              );
            } catch (emailError) {
              console.error(
                "Failed to send incorrect password email:",
                emailError
              );
            }

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
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.userId = user.userId;
        token.department = user.department;
      }

      return token;
    },

    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.role = (token.role as UserRole) ?? "employee";
        session.user.userId = token.userId ?? "";
        session.user.department = token.department ?? "";
      }

      return session;
    },
  },

  trustHost: true,
};

const nextAuthHandler = NextAuth(authConfig) as any;

export const {
  auth,
  signIn,
  signOut,
  handlers,
} = nextAuthHandler;

export default nextAuthHandler;