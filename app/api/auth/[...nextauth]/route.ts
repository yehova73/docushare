import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";

const handler = NextAuth(authOptions);

// Export handlers for both GET and POST methods.
export { handler as GET, handler as POST };
