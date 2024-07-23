import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../../assets/css/Layout.css";

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
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          <header>
            <div className="logo">
              <img src="/images/logo.jpg" alt="Logo" />
            </div>
            <nav>
              <ul>
                <li>
                  <a href="#">Finance</a>
                </li>
                <li>
                  <a href="#">Technology</a>
                </li>
                <li>
                  <a href="#">Lifestyle</a>
                </li>
                <li>
                  <a href="#">Markets</a>
                </li>
                <li>
                  <a href="#">Bombay</a>
                </li>
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
                <li>
                  <a href="#">LINK 1</a>
                </li>
                <li>
                  <a href="#">LINK 2</a>
                </li>
                <li>
                  <a href="#">LINK 3</a>
                </li>
                <li>
                  <a href="#">LINK 4</a>
                </li>
                <li>
                  <a href="#">LINK 5</a>
                </li>
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
