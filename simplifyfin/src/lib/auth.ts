import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { authConfig } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

const emailServer =
  process.env.EMAIL_SERVER ??
  "smtp://user:pass@smtp.gmail.com:587";
const emailFrom =
  process.env.EMAIL_FROM ?? "BudgetFreely <noreply@localhost>";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Nodemailer({
      server: emailServer,
      from: emailFrom,
    }),
  ],
});
