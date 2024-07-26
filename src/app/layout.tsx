import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../../assets/css/Layout.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Bombay Forum",
  description: "Get your daily dose of news from The Bombay Forum",
};

export default function RootLayout({
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

  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          <header>
            <div className="logo">
              <Link href="/">
                <img src="/images/logo.png" alt="Logo" />
              </Link>
              <h1 className="title">
                <Link href="/">The Bombay Forum</Link>
              </h1>
            </div>
            <nav>
              <ul>
                {
                  navList.map((navItem) => (
                    <div key={navItem.name}>
                      <Link href={navItem.link}>{navItem.name}</Link>
                    </div>
                  ))
                }
              </ul>
            </nav>
            {/* <div className="login">
                <a href="#">Login</a>
              </div> */}
          </header>
          {children}
          <section className="footer">
            <div className="footer-links">
              <ul>
                {
                  navList.map((navItem) => (
                    <li key={navItem.name}>
                      <Link href={navItem.link}>{navItem.name}</Link>
                    </li>
                  ))
                }
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
      </body>
    </html>
  );
}
