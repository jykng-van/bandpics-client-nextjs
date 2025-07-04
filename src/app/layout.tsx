import type { Metadata } from "next";
import LoginIcon from '@mui/icons-material/Login';
//import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/* const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
}); */

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Band Pics</title>
      </head>
      <body
        className="antialiased min-h-screen py-8 px-4 gap-4 grid grid-rows-[auto_1fr_auto]"
      >
        <header className=""><strong className="font-bold text-xl">Live Show Pictures</strong><LoginIcon /></header>
        <main className="items-center font-[family-name:var(--font-geist-sans)]">
          {children}
        </main>
        <footer>{`${(new Date().getFullYear())}`}</footer>
      </body>
    </html>
  );
}
