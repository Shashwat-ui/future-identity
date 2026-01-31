import { DefaultSession } from "next-auth";

// Extend NextAuth session types so session.user has an id

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
