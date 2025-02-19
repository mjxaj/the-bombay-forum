"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, Bell } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Weather from "./Weather";

const sections = [
  { name: "Markets", href: "/category/markets" },
  { name: "Finance", href: "/category/finance" },
  { name: "Technology", href: "/category/technology" },
  { name: "Lifestyle", href: "/category/lifestyle" },
  { name: "Bombay", href: "/category/bombay" },
];

export function Navbar() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          <div className="flex items-center justify-between h-20">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <nav className="space-y-6 mt-8">
                  {sections.map((section) => (
                    <Link
                      key={section.name}
                      href={section.href}
                      className="block px-2 py-1.5 text-lg font-serif hover:text-primary transition-colors"
                    >
                      {section.name}
                    </Link>
                  ))}
                </nav>
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
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold tracking-tight group-hover:text-primary/90 transition-colors">
                  The Bombay Forum
                </h1>
                <p className="text-xs font-serif text-muted-foreground mt-1 tracking-wide uppercase">
                  India's Premier Business & Finance Publication
                </p>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/search" className="lg:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-accent">
                  <Search className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/notifications" className="hidden md:block">
                <Button variant="ghost" size="icon" className="hover:bg-accent">
                  <Bell className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/subscribe">
                <Button size="sm" className="hidden md:flex font-medium">
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