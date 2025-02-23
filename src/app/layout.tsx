import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; //(removed Inter)
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext'
import { PostHogProvider } from './providers'
import Script from 'next/script';
import Image from 'next/image';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

//const inter = Inter({ subsets: ['latin'] });  //not used?

export const metadata: Metadata = {
  title: "BabyGPT",
  description: "Get instant, reliable answers to all your parenting questions",
  // icons: {
    // icon: 'favicon.ico', //Make sure to add a favicon to your public folder }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      {/* Meta Pixel Code */}
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1919534348853960');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
  <Image
    src="https://www.facebook.com/tr?id=1919534348853960&ev=PageView&noscript=1"
    alt=""
    width={1}
    height={1}
    style={{display: 'none'}}
    unoptimized // Important to avoid Next.js optimizing the tracking pixel
  />
</noscript>
      {/* End Meta Pixel Code */}
    </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PostHogProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}


