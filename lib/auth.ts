import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
// import { handleMagicLinkRequest } from "./magic-link-request";
import { prisma } from "@/lib/prisma";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { addMonths } from "date-fns";
import { handleNewUserFields } from "@/actions/account/account";
import { emailService } from "./emails/email-service";
// import { emailService } from "./emails/email-service";

export const authPrismaAdapter = PrismaAdapter(prisma) as Adapter;

export const authOptions: NextAuthOptions = {
  adapter: authPrismaAdapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/?action=login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email or password");
        }
        console.log("credentials", credentials.email, credentials.password);
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("Incorrect email or password");
        }

        if (!user.password) {
          throw new Error(
            "Sign in method not availabile! Please use your social signin or magic link!",
          );
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!passwordMatch) {
          throw new Error("Incorrect email or password");
        }

        return user;
      },
    }),

    GoogleProvider({
      clientId: process.env.NEXTAUTH_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXTAUTH_GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    EmailProvider({
      sendVerificationRequest: async (params) => {
        console.log("Magic link params", params);
        await emailService.sendMagicLinkEmail(params);
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, trigger, session, user }) => {
      // Handle updates triggered via session.update
      // console.log("jwt", trigger, user, session, token);
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.email) token.email = session.email;
        if (session.id) token.id = session.id;
      }

      if (user) {
        return {
          ...token,
          id: user.id,
        };
      }

      return token;
    },

    session: async ({ session, token }) => {
      // console.log("session", session, token);
      if (session.user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id ?? token.sub,
          },
        };
      }
      return session;
    },
    signIn: async ({ user, account, profile }) => {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email || "" },
      });

      if (existingUser?.deletedAt) {
        return false; // Blocks deleted profiles from logging in
      }

      // NextAuth automatically creates the account relation row now.
      // We can just handle optional metadata updates here.
      if (account?.provider === "google" && existingUser) {
        if (!existingUser.image && user.image) {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { image: user.image },
          });
        }
      }
      // const existingUser = await prisma.user.findUnique({
      //   where: { email: user.email || "" },
      //   include: { accounts: true },
      // });

      // if (existingUser?.deletedAt) {
      //   return false;
      // }
      // if (account?.provider === "google") {
      //   // If user exists but Google account isn't linked yet
      //   if (
      //     existingUser &&
      //     !existingUser.accounts.some((acc) => acc.provider === "google")
      //   ) {
      //     await prisma.account.create({
      //       data: {
      //         userId: existingUser.id,
      //         type: "oauth",
      //         provider: account.provider,
      //         providerAccountId: account.providerAccountId,
      //         access_token: account.access_token,
      //         token_type: account.token_type,
      //         id_token: account.id_token,
      //         scope: account.scope,
      //         expires_at: account.expires_at,
      //         refresh_token: account.refresh_token,
      //       },
      //     });

      //     if (existingUser && !existingUser.image && user.image) {
      //       await prisma.user.update({
      //         where: { id: existingUser.id },
      //         data: {
      //           image: user.image,
      //         },
      //       });
      //     }

      //     return true;
      //   }

      //   // Account already linked or new user
      //   return true;
      // }

      return true; // For other providers
    },
  },
  events: {
    createUser: async ({ user }) => {
      await handleNewUserFields(user.id);
      if (user.email) {
        await emailService.sendWelcomeEmail({
          email: user.email,
          name: user.name || "",
        });
      }
    },
  },
  // debug: process.env.NODE_ENV === "development",
};
