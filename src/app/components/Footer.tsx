import Link from "next/link";

const sections = [
  {
    title: "News",
    links: [
      { name: "Markets", href: "/category/markets" },
      { name: "Finance", href: "/category/finance" },
      { name: "Technology", href: "/category/technology" },
      { name: "Lifestyle", href: "/category/lifestyle" },
      { name: "Bombay", href: "/category/bombay" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Contact Us", href: "/contact" },
      { name: "Careers", href: "/careers" },
      { name: "Advertise", href: "/advertise" },
    ],
  },
  {
    title: "Services",
    links: [
      { name: "Subscribe", href: "/subscribe" },
      { name: "Mobile Apps", href: "/apps" },
      { name: "RSS Feeds", href: "/rss" },
      { name: "Newsletters", href: "/newsletters" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        {/* Logo and Tagline */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block">
            <h2 className="text-3xl font-serif font-bold">The Bombay Forum</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Delivering insightful news and analysis
            </p>
          </Link>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-serif font-bold mb-4">{section.title}</h3>
              <ul className="space-y-2">
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
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <div className="mb-4 md:mb-0">
              © {new Date().getFullYear()} The Bombay Forum. All Rights Reserved.
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="hover:text-primary transition-colors">
                Site Map
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 