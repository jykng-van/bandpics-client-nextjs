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
const refresh_domain = `https://${process.env.USER_POOL_ID?.replace('_','')}.auth.${process.env.COGNITO_REGION}.amazoncognito.com`;
//because the refresh domain prefix is the user pool id without the _ in it
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
        async jwt({ token, account, user, profile }) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            /* console.log('jwt callback account', account);
            console.log('jwt callback token', token); */

            if (token && account) { //initial signin, because account sent
                console.log('jwt callback: new account', account);
                console.log('jwt callback token', account);
                console.log('jwt callback user', user);
                console.log('jwt callback profile', profile);
                return {
                    ...token,
                    accessToken : account.access_token, //set access token
                    refreshToken : account.refresh_token, //set refresh token
                    accessTokenExpires : (account.expires_at as number) * 1000, //set when token expires at, in milliseconds from seconds
                    idToken : account.id_token, //set idToken
                    sub: user.id,
                    user,
                    profile,
                }

                //token.id = token.sub;
            }
            const secret_hash = `Basic ${Buffer.from(
                `${process.env.COGNITO_CLIENT_ID}:${process.env.COGNITO_CLIENT_SECRET}`
            ).toString("base64")}`;
            console.log('secret_hash', secret_hash);
            // Return previous token if the access token has not expired yet
            if (typeof token.accessTokenExpires === 'number' && Date.now() < token.accessTokenExpires) {
                console.log('Not expired, just sending token');
                return token;
            }

            // Access token has expired, try to update it
            console.log('Refreshing token');
            try {
                const res = await fetch(
                    `${refresh_domain}/oauth2/token`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            Authorization: secret_hash,
                        },
                        body: new URLSearchParams({
                            grant_type: "refresh_token",
                            client_id: process.env.COGNITO_CLIENT_ID as string,
                            //client_secret: process.env.COGNITO_CLIENT_SECRET as string,
                            refresh_token: token.refreshToken as string,
                        }),
                    }
                );
                if (res.ok) {
                    const refreshedTokens = await res.json();
                    console.log('Refresh successful', refreshedTokens);
                    return {
                        ...token,
                        accessToken: refreshedTokens.access_token,
                        accessTokenExpires: refreshedTokens.expires_at * 1000,
                        refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Use new refresh token if available
                    };
                } else {
                    console.error("Error with refresh token request", res);
                    return { ...token, error: "RefreshTokenError" };
                }
            } catch (err) {
                console.error("Error refreshing token", err);
                return { ...token, error: "RefreshTokenError" };
            }
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

