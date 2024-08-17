import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../../assets/css/Layout.scss";
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
    { name: "Lifestyle", link: "/category/lifestyle" },
    { name: "Finance", link: "/category/finance" },
    { name: "Markets", link: "/category/markets" },
    { name: "Technology", link: "/category/technology" },
    { name: "Bombay", link: "/category/bombay" },
  ];

  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout session={session}>
          <div>
            <header>
              <div className="mobile-nav">
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
                    {navList.map((navItem) => (
                      <div key={navItem.name}>
                        <Link href={navItem.link}>{navItem.name}</Link>
                      </div>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="desktop-nav">
                <nav>
                  {/* show half categories */}
                  <ul>
                    {navList
                      .slice(0, Math.ceil(navList.length / 2))
                      .map((navItem) => (
                        <li key={navItem.name}>
                          <Link href={navItem.link}>{navItem.name}</Link>
                        </li>
                      ))}
                  </ul>
                  {/* show logo */}
                  <ul>
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
                  </ul>

                  {/* show other half */}
                  <ul>
                    {navList
                      .slice(Math.ceil(navList.length / 2), navList.length)
                      .map((navItem) => (
                        <li key={navItem.name}>
                          <Link href={navItem.link}>{navItem.name}</Link>
                        </li>
                      ))}
                  </ul>
                </nav>
              </div>
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
