import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from '@/components/AuthContext'
import "./globals.css";
import localFont from 'next/font/local';
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Add this for better performance
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const auralyess = localFont({
  src: './fonts/Auralyess.woff2',
  variable: '--font-auralyess',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Abyss",
  description: "Next Gen AI therapist",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={auralyess.variable}>
      <body className="antialiased">
       <AuthProvider>
          {children}
           <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
