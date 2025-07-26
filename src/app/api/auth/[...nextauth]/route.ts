import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
//import { NextAuthOptions } from "next-auth";

const issuer = `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.USER_POOL_ID}`;
console.log(issuer);
//const handler: NextAuthOptions = {
const handler = NextAuth({
    // Configure one or more authentication providers
    providers: [
        CognitoProvider({
            clientId: process.env.COGNITO_CLIENT_ID as string,
            clientSecret: process.env.COGNITO_CLIENT_SECRET as string,
            issuer: issuer,
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            console.log(session);
            console.log('session callback', token);
            // Send properties to the client, like an access_token and user id from a provider.
            session.user.accessToken = token.accessToken as string;
            session.user.refreshToken = token.refreshToken as string;
            session.user.id = token.sub;

            return session
        },
        async jwt({ token, account }) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            console.log('jwt callback account', account);
            console.log('jwt callback token', token);

            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                //token.id = token.sub;
            }
            return token
        }
    }
//};
});

export { handler as GET, handler as POST };

