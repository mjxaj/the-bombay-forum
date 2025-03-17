"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";

const sections = [
  {
    title: "News",
    links: [
      { name: "Local News", href: "/category/local" },
      { name: "Politics", href: "/category/politics" },
      { name: "Business", href: "/category/business" },
      { name: "Education", href: "/category/education" },
      { name: "Entertainment", href: "/category/entertainment" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Contact Us", href: "/contact" },
      { name: "Advertise", href: "/advertise" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  },
];

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left space-y-2 md:w-1/2">
                <h2 className="text-2xl font-serif font-bold">Stay Updated</h2>
                <p className="text-muted-foreground">
                  Get the latest Chandigarh news delivered to your inbox
                </p>
              </div>
              <div className="w-full md:w-1/2 max-w-md">
                <form className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="h-11"
                    />
                  </div>
                  <Button size="lg">
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-2">
                  By subscribing, you agree to our Privacy Policy and Terms of Service
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <img 
                src="/City News Chandigarh/navbar_logo.png"
                alt="City News Chandigarh"
                className="h-32 w-40 mb-4"
              />
              <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                Your trusted source for Chandigarh news and updates
              </p>
            </Link>
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="p-2 rounded-full hover:bg-accent transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-serif text-sm font-semibold tracking-wide uppercase mb-6">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="order-2 md:order-1">
              <p className="font-serif text-center md:text-left">
                © {new Date().getFullYear()} City News Chandigarh. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 order-1 md:order-2">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 