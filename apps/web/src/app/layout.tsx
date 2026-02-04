import type { Metadata } from "next";
import "./globals.css";
import { NextTamaguiProvider } from "./NextTamaguiProvider";

export const metadata: Metadata = {
  title: "Bookendd",
  description: "Track your reading journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextTamaguiProvider>{children}</NextTamaguiProvider>
      </body>
    </html>
  );
}
