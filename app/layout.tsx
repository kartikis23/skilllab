import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hostel Management",
  description: "Full-stack hostel management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="app-shell">
          <header className="border-b border-white/10 bg-black/35 backdrop-blur-md">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-lg font-semibold tracking-wide text-white">
                HostelMS
              </Link>
              <div className="flex gap-2 text-sm sm:gap-3">
                <Link href="/dashboard" className="rounded-full px-3 py-1.5 text-zinc-200 hover:bg-white/10 hover:text-white">
                  Dashboard
                </Link>
                <Link href="/students" className="rounded-full px-3 py-1.5 text-zinc-200 hover:bg-white/10 hover:text-white">
                  Students
                </Link>
                <Link href="/rooms" className="rounded-full px-3 py-1.5 text-zinc-200 hover:bg-white/10 hover:text-white">
                  Rooms
                </Link>
                <Link href="/payments" className="rounded-full px-3 py-1.5 text-zinc-200 hover:bg-white/10 hover:text-white">
                  Payments
                </Link>
              </div>
            </nav>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
