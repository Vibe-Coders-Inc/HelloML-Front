import type { Metadata } from "next";
import { Geist, Geist_Mono, Borel } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import { getMetadata } from "@/lib/content";
import { FooterWrapper } from "@/components/FooterWrapper";
import { ContentWrapper } from "@/components/ContentWrapper";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const borel = Borel({
  variable: "--font-borel",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = getMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places&loading=async`}
          strategy="afterInteractive"
          async
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-11501080696"
          strategy="afterInteractive"
          async
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-11501080696');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${borel.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-screen flex flex-col">
            <ContentWrapper>{children}</ContentWrapper>
            <FooterWrapper />
          </div>
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
