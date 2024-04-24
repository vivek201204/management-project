import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ApiError } from "../../../../utility/ApiError";
import prisma from "../../../../constants/prisma";
import bcrypt from "bcrypt";
import NextAuth from "next-auth/next";
import { User } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXT_AUTH_SECRET,
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "email",
          placeholder: "enter your email",
        },
        password: {
          label: "password",
          placeholder: "enter your password",
        },
      },
      async authorize(credentials) {
        if (!credentials)
          throw new ApiError(411 , "please provide us full information")
        console.log("cred", credentials);

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
         throw new ApiError(404 , "user not found with this email")
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordCorrect) {
         throw new ApiError(400 , "password incorrect")
        }

        const { password, ...userWithoutPass } = user;
        console.log(userWithoutPass);

        return userWithoutPass;
      },
    }),
  ],
  pages: {
    signIn: "/users/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
    

      if (user) token.user = user as User;
     

      return token;
    },

    async session({ token, session }) {
      session.user = token.user;
     

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
