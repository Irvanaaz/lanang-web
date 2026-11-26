import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LANANG, Lapak Pinang - Jajan tinggal klik",
  description:
    "Katalog digital UMKM kuliner di Kelurahan Pinang. Temukan jajanan lokal dan pesan langsung lewat WhatsApp.",
};

export const viewport: Viewport = {
  themeColor: "#e8590c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${fredoka.variable} ${nunito.variable}`}>
      <body className="min-h-screen bg-page text-ink selection:bg-brand/20">
        {children}
      </body>
    </html>
  );
}
