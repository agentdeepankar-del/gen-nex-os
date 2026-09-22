import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEN NEX OS - Sports Academy Operating System",
  description: "Prevent revenue leakage. Track every player. Every payment. Every development milestone.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}
