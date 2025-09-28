import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZamaVoting - Confidential Voting System",
  description: "A privacy-preserving voting system using FHEVM technology",
  keywords: ["voting", "privacy", "FHEVM", "blockchain", "confidential"],
  authors: [{ name: "ZamaVoting Team" }],
  openGraph: {
    title: "ZamaVoting - Confidential Voting System",
    description: "A privacy-preserving voting system using FHEVM technology",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
