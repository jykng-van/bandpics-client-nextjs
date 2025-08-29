'use client'

import { SessionProvider } from "next-auth/react";
import { ReactNode } from 'react'
import { ConfirmDialog } from "./confirm_dialog";


export const Providers = ({ children }: { children: ReactNode }) => {

  return <SessionProvider>
    <ConfirmDialog>
      {children}
    </ConfirmDialog>
  </SessionProvider>
}