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

/* import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { CognitoIdentityProviderClient, InitiateAuthCommand, AuthFlowType, RespondToAuthChallengeCommand } from '@aws-sdk/client-cognito-identity-provider';
import { createHmac } from 'crypto';

//import process from 'process';



const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Username" },
                password: { label: "Password", type: "password" }
            },

            authorize: async (credentials) => {
                // Initialize Cognito
                const cognito = new CognitoIdentityProviderClient({ region: process.env.COGNITO_REGION});

                if (!credentials) return null;


                // Create SECRET_HASH for cognito authentication
                const hasher = createHmac('sha256', process.env.COGNITO_CLIENT_SECRET as string); // create HMAC hasher with client secret
                hasher.update(credentials.username + process.env.COGNITO_CLIENT_ID); //combine username and client ID for hashing
                const secret_hash = hasher.digest('base64'); // get base64 encoded hash

                const params = new InitiateAuthCommand({
                    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
                    AuthParameters: {
                        USERNAME: credentials.username,
                        PASSWORD: credentials.password,
                        SECRET_HASH: secret_hash,
                    },
                    ClientId: process.env.COGNITO_CLIENT_ID as string,
                });

                try {
                    const response = await cognito.send(params);
                    console.log(response);

                    if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED'){ //new password required


                    }


                    const user = {
                        id: response.ChallengeParameters?.USER_ID_FOR_SRP as string, // User ID for Secure Remote Password
                        name: credentials.username,
                        challengeName: response.ChallengeName,
                    };
                    console.log(user);
                    return user;
                } catch (error) {
                    console.error(error);
                    return null;
                }
            }
        })
    ]
})

export { handler as GET, handler as POST } */