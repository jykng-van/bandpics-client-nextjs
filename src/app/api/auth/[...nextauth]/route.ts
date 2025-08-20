import NextAuth from "next-auth";
//import CognitoProvider from "next-auth/providers/cognito";
import { config } from '@/app/helpers/auth';
//import { NextAuthOptions } from "next-auth";

const issuer = `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.USER_POOL_ID}`;
console.log('issuer',issuer);
//const handler: NextAuthOptions = {
const handler = NextAuth(config);

export { handler as GET, handler as POST };

