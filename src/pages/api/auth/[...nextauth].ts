import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Define the shape of the credentials object
interface Credentials {
  email: string;
  password: string;
}
const authOptions = {
  session: {
    maxAge: 85000,
    strategy: 'jwt', // Set the session strategy to 'jwt'
  },
  callbacks: {
    async signInError(error: any) {
      throw new Error(error.message);
    },
    async jwt({
      token,
      user,
    }: {
      token: { id: string; data: any | null };
      user: any;
    }) {
      if (user) {
        token.id = user.access_token;
        token.data = user;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: { user: any; accessToken: any | null };
      token: { id: string; data: any | null };
    }) {
      session.user.id = token.id;
      session.user.data = token.data;
      session.accessToken = token.id;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {
        // Define the shape of the credentials object using the interface
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const Options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          };
          const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/session`;
          const response = await fetch(url, Options);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
          }
          const json = await response.json();

          if (json.code) throw new Error(json.description);

          if (
            json.type !== 'WIIQARE_MANAGER' &&
            json.type !== 'WIIQARE_ADMIN'
          ) {
            throw new Error("Vous n'êtes pas autorisé à vous connecter");
          }

          return json;
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: 'auth/Login',
  },
  secret: 'secretpeterwiiqareuniceftoken',
};

export default NextAuth(authOptions as any);
