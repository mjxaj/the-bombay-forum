import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../../assets/css/Layout.css";
import Link from "next/link";
import Image from "next/image";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import ClientLayout from "./ClientLayout";

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
    { name: "Finance", link: "/category/finance" },
    { name: "Technology", link: "/category/technology" },
    { name: "Lifestyle", link: "/category/lifestyle" },
    { name: "Markets", link: "/category/markets" },
    { name: "Bombay", link: "/category/bombay" },
  ];

  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout session={session}>
          <div>
            <header>
              <div className="logo">
                <Link href="/">
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={93}
                    height={40}
                  />
                </Link>
                <h1 className="title">
                  <Link href="/">The Bombay Forum</Link>
                </h1>
              </div>
              <nav>
                <ul>
                  <div>
                    {!session ? (
                      <Link href="/login">Login</Link>
                    ) : (
                      <Link href="/try">Logout</Link>
                    )}
                  </div>

                  {navList.map((navItem) => (
                    <div key={navItem.name}>
                      <Link href={navItem.link}>{navItem.name}</Link>
                    </div>
                  ))}
                </ul>
              </nav>
            </header>
            {children}
            <section className="footer">
              <div className="footer-links">
                <ul>
                  {navList.map((navItem) => (
                    <li key={navItem.name}>
                      <Link href={navItem.link}>{navItem.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="footer-subscription">
                <h2>Letter Subscription</h2>
                <input type="email" placeholder="Enter your email id" />
                <button>Subscribe</button>
              </div>
              <div className="footer-info">
                <p>Copyright © 2010-2024 TBF. All rights reserved.</p>
              </div>
            </section>
          </div>
        </ClientLayout>
      </body>
    </html>
  );
}
