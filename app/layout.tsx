// this all runs on the server

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import ClientLayout from './ClientLayout';
import { MIXPANEL_SNIPPET } from "@/lib/mixpanel-snippet";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "FixPanel",
  description: "real fake demo apps for fun and profit!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Loads the Mixpanel lib from our custom URL before hydration. */}
        <Script
          id="mixpanel-snippet"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: MIXPANEL_SNIPPET }}
        />
      </head>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}