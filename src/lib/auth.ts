import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import {dbConnect}  from "./db"; 
import type { UserRole } from "@/types";

declare module "next-auth" {
  interface User {
    id: string;
    role?: UserRole;
    userId?: string;
  }
  interface Session {user: {
      id: string;
      userId: string;
      email: string;
      name: string;
      role: UserRole;
      image?: string | null;
    };
  }
}
declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    userId?: string;
  }
}
export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userId: { label: "User ID", type: "text" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials){
      try {
        await dbConnect();
        const user = await User.findOne({
          userId: credentials?.userId,
          role: credentials?.role,
        });
        if (!user) {
          throw new Error("User not found");
        }
        const validPassword = await bcrypt.compare(
          credentials!.password as string,
          user.password
        );
        if (!validPassword) {
          throw new Error("Invalid password");
        }
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          userId: user.userId,
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Authentication failed");
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
    
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.userId = user.userId ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string ?? "";
        session.user.role = (token.role as UserRole) ?? "EMPLOYEE";
        session.user.userId = token.userId as string ?? "";
      }
      return session;
    },
  },
  trustHost: true,
};

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);



