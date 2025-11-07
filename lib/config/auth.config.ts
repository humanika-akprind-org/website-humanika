import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../prisma";
import { loginUser } from "../auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const response = await loginUser(
          credentials.email,
          credentials.password
        );

        if (!response.success || !response.user) {
          throw new Error(response.error || "Invalid credentials");
        }

        return {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          department: response.user.department?.toString() || undefined,
          position: response.user.position?.toString() || undefined,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.department = user.department;
        token.position = user.position;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.department = token.department as string | undefined;
        session.user.position = token.position as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
};
