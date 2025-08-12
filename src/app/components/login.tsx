'use client'
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
//import { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Login() {
    const session = useSession();
    console.log(session);
    console.log(session.data);
    return (
        <>
            {
                session.status === "authenticated" ? (
                    <div>
                        Hello, {session.data?.user?.name}!
                        <button id="logout-button" onClick={() => signOut()}><LogoutIcon /></button>
                    </div>
                ) : (
                    <button id="login-button" onClick={() => signIn('cognito')}>Login <LoginIcon /></button>
                )
            }
        </>
    )
}