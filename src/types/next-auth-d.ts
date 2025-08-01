import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** Oauth access token */
      accessToken?: string;
      refreshToken?: string;
      idToken?: string;
      id?: string;
    } & DefaultSession["user"];
  }
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
  }
}