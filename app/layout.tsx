// this all runs on the server

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientLayout from './ClientLayout';

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "FixPanel",
  description: "real fake demo apps for fun and profit!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}