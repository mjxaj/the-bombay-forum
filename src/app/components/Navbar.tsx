import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu } from "lucide-react";
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
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        {/* Top Bar with Weather */}
        <div className="py-2 border-b border-border">
          <Weather />
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4 border-b border-border">
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
              <Button variant="ghost" size="sm" className="hidden lg:flex hover:bg-background/50">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </Link>
          </div>

          <div className="text-center flex-1">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">The Bombay Forum</h1>
              <p className="text-xs font-serif text-muted-foreground mt-1.5 tracking-wide uppercase">{today}</p>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/search">
              <Button variant="ghost" size="sm" className="lg:hidden hover:bg-background/50">
                <Search className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:block py-3">
          <ul className="flex items-center justify-center space-x-12">
            {sections.map((section) => (
              <li key={section.name}>
                <Link
                  href={section.href}
                  className="text-sm font-serif hover:text-primary transition-colors tracking-wide uppercase"
                >
                  {section.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
} 