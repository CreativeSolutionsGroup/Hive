import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { exit } from "process";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma";

if (
  process.env.GOOGLE_CLIENT_ID == null ||
  process.env.GOOGLE_CLIENT_SECRET == null
) exit(1);

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user: { email }}) {
      return !!prisma.user.count({
        where: {
          email
        }
      })
    }
  }
}
export default NextAuth(authOptions)