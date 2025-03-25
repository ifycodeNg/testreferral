'use client';
import { useEffect } from 'react';
import type { Metadata } from 'next';
import { useSearchParams } from 'next/navigation';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const referralCode = searchParams.get('grsf'); // Extract referral code from URL

    if (referralCode) {
      localStorage.setItem('referralCode', referralCode); // Store in localStorage
      console.log('Referral code saved:', referralCode);
    }

    const script = document.createElement('script');
    script.src = 'https://app.growsurf.com/growsurf.js';
    script.async = true;
    script.setAttribute('grsf-campaign', '10inlw'); // Set your campaign ID

    script.onload = () => {
      console.log('GrowSurf script loaded.');
    };

    document.body.appendChild(script);
  }, [searchParams]);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
