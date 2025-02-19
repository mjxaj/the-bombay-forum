"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, Bell, X, ChevronRight, Home, Newspaper, BookOpen, Bookmark, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import Weather from "./Weather";
import { useState } from "react";

const sections = [
  { name: "Markets", href: "/category/markets", icon: BookOpen },
  { name: "Finance", href: "/category/finance", icon: Newspaper },
  { name: "Technology", href: "/category/technology", icon: Settings },
  { name: "Lifestyle", href: "/category/lifestyle", icon: Bookmark },
  { name: "Bombay", href: "/category/bombay", icon: Home },
];

const quickLinks = [
  { name: "Subscribe", href: "/subscribe", primary: true },
  { name: "Notifications", href: "/notifications" },
  { name: "Latest News", href: "/latest" },
  { name: "Trending", href: "/trending" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="border-b border-border/40">
        <div className="container mx-auto px-4">
          {/* Top Bar with Weather and Date */}
          <div className="flex items-center justify-between h-10 text-sm">
            <Weather />
            <div className="text-muted-foreground font-serif hidden md:block">
              {today}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-border">
        <div className="container mx-auto px-4">
          {/* Main Header */}
          <div className="flex items-center justify-between h-16 md:h-20">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden relative group">
                  <Menu className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-80 p-0">
                <div className="flex flex-col h-full bg-card">
                  {/* Header */}
                  <div className="p-6 bg-primary/5 border-b border-border">
                    <div className="flex items-center justify-between">
                      <Link href="/" onClick={() => setIsOpen(false)} className="font-serif font-bold text-xl">
                        The Bombay Forum
                      </Link>
                      <SheetClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-background/80 transition-colors">
                      
                        <span className="sr-only">Close menu</span>
                      </SheetClose>
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="flex-1 overflow-auto px-6 py-8">
                    <div className="space-y-8">
                      {/* Main Sections */}
                      <div>
                        <h3 className="text-xs font-medium text-muted-foreground mb-4 px-2">
                          MAIN SECTIONS
                        </h3>
                        <div className="space-y-1">
                          {sections.map((section) => {
                            const Icon = section.icon;
                            return (
                              <Link
                                key={section.name}
                                href={section.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center px-2 py-3 rounded-lg text-base font-medium hover:bg-accent transition-colors group"
                              >
                                <div className="flex items-center gap-3">
                                  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                  <span>{section.name}</span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      {/* Quick Links */}
                      <div>
                        <h3 className="text-xs font-medium text-muted-foreground mb-4 px-2">
                          QUICK LINKS
                        </h3>
                        <div className="space-y-1">
                          {quickLinks.map((link) => (
                            <Link
                              key={link.name}
                              href={link.href}
                              onClick={() => setIsOpen(false)}
                              className={`block px-2 py-3 rounded-lg text-base transition-colors ${
                                link.primary
                                  ? "text-primary font-medium hover:bg-primary/10"
                                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
                              }`}
                            >
                              {link.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </nav>

                  {/* Footer */}
                  <div className="p-6 border-t border-border bg-card">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>© 2024 The Bombay Forum</span>
                      <Link 
                        href="/terms" 
                        onClick={() => setIsOpen(false)}
                        className="hover:text-primary transition-colors"
                      >
                        Terms
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center space-x-4">
              <Link href="/search">
                <Button variant="ghost" size="sm" className="hidden lg:flex hover:bg-accent">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </Link>
            </div>

            <div className="text-center flex-1">
              <Link href="/" className="inline-block group">
                <h1 className="text-xl md:text-3xl lg:text-4xl font-serif font-bold tracking-tight group-hover:text-primary/90 transition-colors">
                  The Bombay Forum
                </h1>
                <p className="text-[10px] md:text-xs font-serif text-muted-foreground mt-0.5 tracking-wide uppercase">
                  India's Premier Business & Finance Publication
                </p>
              </Link>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <Link href="/notifications" className="hidden md:block">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-accent relative group"
                >
                  <Bell className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                </Button>
              </Link>
              <Link href="/subscribe">
                <Button 
                  size="sm" 
                  className="hidden md:flex font-medium transition-transform duration-200 hover:scale-105"
                >
                  Subscribe
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex items-center justify-center h-12 -mx-4">
              {sections.map((section) => (
                <li key={section.name} className="px-4">
                  <Link
                    href={section.href}
                    className="text-sm font-serif hover:text-primary transition-colors tracking-wide uppercase relative py-3 px-1 after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                  >
                    {section.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
} 