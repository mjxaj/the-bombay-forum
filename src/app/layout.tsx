import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import ClientLayout from "./ClientLayout";
import DarkButton from "./components/DarkButton";
import SearchBarClient from "./components/SearchBarClient";
import NewsletterSubscription from "./components/NewsletterSubscription";
import Weather from "./components/Weather";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Bombay Forum",
  description: "Get your daily dose of news from The Bombay Forum",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navList = [
    { name: "Lifestyle", link: "/category/lifestyle" },
    { name: "Finance", link: "/category/finance" },
    { name: "Markets", link: "/category/markets" },
    { name: "Technology", link: "/category/technology" },
    { name: "Bombay", link: "/category/bombay" },
  ];

  const privacyPolicy = [
    { name: "Terms and conditions", link: "/terms/conditions" },
    { name: "Privacy policy", link: "/terms/privacy" },
  ];

  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        {process.env.NODE_ENV === "production" && (
          <>
            {/* Add the Google Analytics script */}
            <script async src={`https://www.googletagmanager.com/gtag/js?id=G-SXGQN0NSTW`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-SXGQN0NSTW', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        {process.env.NODE_ENV === "production" && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7601934185385486"
            crossOrigin="anonymous"
          ></script>
        )}
      </head>
      <body className={inter.className}>
        <ClientLayout session={session}>
          <div>
            {/* Desktop Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#011E29] shadow-md">
              <div className="container mx-auto">
                <nav className="hidden lg:flex items-center justify-between h-16 px-4">
                  <div className="flex items-center space-x-8">
                    {navList.slice(0, Math.ceil(navList.length / 2)).map((item) => (
                      <Link 
                        key={item.name} 
                        href={item.link}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Link href="/search">
                      <SearchBarClient />
                    </Link>
                    <Link href="/" className="flex items-center space-x-2">
                      <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={93}
                        height={40}
                        className="h-8 w-auto"
                      />
                      <span className="text-white font-playfair text-xl">The Bombay Forum</span>
                    </Link>
                  </div>

                  <div className="flex items-center space-x-8">
                    {navList.slice(Math.ceil(navList.length / 2)).map((item) => (
                      <Link 
                        key={item.name} 
                        href={item.link}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                    <DarkButton />
                  </div>
                </nav>

                {/* Mobile Navigation */}
                <nav className="lg:hidden flex items-center justify-between h-16 px-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-white">
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] bg-[#011E29]">
                      <div className="flex flex-col space-y-4 mt-8">
                        {navList.map((item) => (
                          <Link 
                            key={item.name} 
                            href={item.link}
                            className="text-white hover:text-gray-300 transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Link href="/" className="flex items-center space-x-2">
                    <Image
                      src="/images/logo.png"
                      alt="Logo"
                      width={93}
                      height={40}
                      className="h-8 w-auto"
                    />
                    <span className="text-white font-playfair text-lg">The Bombay Forum</span>
                  </Link>

                  <div className="flex items-center space-x-2">
                    <Link href="/search">
                      <SearchBarClient />
                    </Link>
                    <DarkButton />
                  </div>
                </nav>
              </div>
              <div className="bg-[#011E29] py-1 px-4">
                <Weather />
              </div>
            </header>

            <div className="mt-20">
              {children}
            </div>

            <section className="bg-[#1d1d1d] text-white">
              <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Link href="/">
                        <Image
                          src="/images/logo.png"
                          alt="Logo"
                          width={53}
                          height={20}
                          className="h-5 w-auto"
                        />
                      </Link>
                      <h1 className="font-playfair text-xl">
                        <Link href="/">The Bombay Forum</Link>
                      </h1>
                    </div>
                    <p className="text-gray-300">
                      Stay informed with the latest headlines, in-depth
                      analysis, and real-time updates from around the globe.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-medium text-lg">Quick Links</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        {navList.map((item) => (
                          <Link
                            key={item.name}
                            href={item.link}
                            className="block text-gray-300 hover:text-white transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                      <div className="space-y-2">
                        {privacyPolicy.map((item) => (
                          <Link
                            key={item.name}
                            href={item.link}
                            className="block text-gray-300 hover:text-white transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <NewsletterSubscription />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800">
                <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <p className="text-gray-400 text-sm">
                    © 2024 The Bombay Forum All Rights Reserved.
                  </p>
                  <div className="flex space-x-4">
                    <Link href="https://www.instagram.com/thebombayforum/">
                      <Image
                        src="/images/social/instagram_logo.png"
                        alt="Instagram"
                        width={30}
                        height={30}
                        className="h-6 w-6"
                      />
                    </Link>
                    <Link href="https://www.threads.net/@thebombayforum">
                      <Image
                        src="/images/social/threads_logo.png"
                        alt="Threads"
                        width={30}
                        height={30}
                        className="h-6 w-6"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </ClientLayout>
      </body>
    </html>
  );
}
