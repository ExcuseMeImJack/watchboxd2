import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import { User } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'hello@example.com'
        },
        password: { label: 'Password', type: 'password'}
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          email: user.email,
          username: user.username,
          profilePicUrl: user.profile_pic_url,
          isPrivate: user.is_private
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (token) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id,
            email: token.email,
            username: token.username,
            profilePicUrl: token.profilePicUrl,
            isPrivate: token.isPrivate
          }
        };
      }
      return session;
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as User;
        return {
          ...token,
          id: u.id,
          email: u.email,
          username: u.username,
          profilePicUrl: u.profile_pic_url,
          isPrivate: u.is_private
        };
      }
      return token;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
