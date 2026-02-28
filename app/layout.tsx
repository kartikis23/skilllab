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
        <div className="min-h-screen bg-gray-50">
          <header className="border-b bg-white">
            <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-lg font-semibold">
                HostelMS
              </Link>
              <div className="flex gap-4 text-sm">
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/students">Students</Link>
                <Link href="/rooms">Rooms</Link>
                <Link href="/payments">Payments</Link>
              </div>
            </nav>
          </header>
          <main className="mx-auto max-w-5xl px-6 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
