import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth/next"
import CognitoProvider from "next-auth/providers/cognito";

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
const issuer = `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.USER_POOL_ID}`;

export const config = {
    providers: [
        CognitoProvider({
            clientId: process.env.COGNITO_CLIENT_ID as string,
            clientSecret: process.env.COGNITO_CLIENT_SECRET as string,
            issuer: issuer,
        }),
    ], // rest of your config
    callbacks: {
        async session({ session, token }) {
            //console.log(session);
            //console.log('session callback', token);
            // Send properties to the client, like an access_token and user id from a provider.
            session.user.accessToken = token.accessToken as string;
            session.user.refreshToken = token.refreshToken as string;
            session.user.idToken = token.idToken as string;
            session.user.id = token.sub;

            return session
        },
        async jwt({ token, account }) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            //console.log('jwt callback account', account);
            //console.log('jwt callback token', token);

            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.idToken = account.id_token;
                //token.id = token.sub;
            }
            return token
        }
    }
} satisfies NextAuthOptions

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
    /* console.log('auth', args);
    console.log('auth_options?', config); */
  return getServerSession(...args, config)
}
