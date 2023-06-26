import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import { exit } from "process";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

if (
  process.env.GOOGLE_CLIENT_ID == null ||
  process.env.GOOGLE_CLIENT_SECRET == null ||
  process.env.MS_CLIENT_ID == null ||
  process.env.MS_CLIENT_SECRET == null
)
  exit(1);

declare module "next-auth" {
  interface Session {
    groupId: string;
    accessibleUsers: Array<string>;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    groupId: string;
    accessibleUsers: Array<string>;
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    AzureADProvider({
      clientId: process.env.MS_CLIENT_ID,
      clientSecret: process.env.MS_CLIENT_SECRET,
      tenantId: process.env.MS_TENANT_ID,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user: { email } }) {
      return !!prisma.user.count({
        where: {
          email,
        },
      });
    },
    async redirect() {
      return "/";
    },
    async jwt({ token, user }) {
      const member = await prisma.user.findFirst({
        where: { email: token.email },
        include: { group: { include: { users: true } } },
      });

      token.groupId = member?.stingGroupId ?? "";

      token.accessibleUsers = member?.group?.users.map((u) => u.id) ?? [];

      return token;
    },
    async session({ session, token }) {
      session.groupId = token.groupId;

      session.accessibleUsers = token.accessibleUsers;

      return session;
    },
  },
};
export default NextAuth(authOptions);
