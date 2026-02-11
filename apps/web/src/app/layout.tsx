import type { Metadata } from "next";
import "./globals.css";
import { NextTamaguiProvider } from "./NextTamaguiProvider";

export const metadata: Metadata = {
  title: "Antilogos",
  description: "Track your reading journey with a single word",
  openGraph: {
    title: "Antilogos",
    description: "Track your reading journey with a single word",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Antilogos",
    description: "Track your reading journey with a single word",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ backgroundColor: "hsla(260, 45%, 10%, 1)" }}>
        <NextTamaguiProvider>{children}</NextTamaguiProvider>
      </body>
    </html>
  );
}
