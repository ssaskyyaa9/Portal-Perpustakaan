import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connection from "../../../../lib/database";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const { email, password } = credentials;
        const [rows] = await connection.execute(
          "SELECT * FROM users WHERE email = ?",
          [email]
        );
        if (rows.length === 0) return null;
        const user = rows[0];

        const match = await bcrypt.compare(password, user.password);
        if (!match) return null;

        if (user.role !== "admin") {
          if (user.is_verified === "menunggu") throw new Error("menunggu");
          if (user.is_verified === "ditolak") throw new Error("ditolak");
        }

        return {
          id: user.id,
          name: user.username,
          email: user.email,
          role: user.role,
          is_verified: user.is_verified,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user, error }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.is_verified = user.is_verified;
      }
      if (error) token.error = error;
      return token;
    },

    async session({ session, token }) {
      const [rows] = await connection.execute(
        "SELECT username, email FROM users WHERE id = ?",
        [token.id]
      );

      const freshUser = rows[0];

      session.user = {
        id: token.id,
        name: freshUser.username,
        email: token.email,
        role: token.role,
        is_verified: token.is_verified,
        status: token.error || null,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);  // <== PENTING
export { handler as GET, handler as POST };