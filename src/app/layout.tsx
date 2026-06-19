import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abhishek Learns — Interview Prep Hub",
  description: "DSA, LLD, HLD, React, Next.js learning tracker for interview prep",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <Providers>
          <Navbar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">{children}</main>
          <footer className="border-t border-[var(--card-border)] py-6">
            <div className="mx-auto max-w-6xl px-4 text-sm text-[var(--muted)]">
              Built for interview prep · DSA, LLD, HLD, React, Next.js & JavaScript
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
