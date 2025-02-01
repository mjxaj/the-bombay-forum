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
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Link href="/" className="inline-block">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">The Bombay Forum</h2>
            <p className="text-sm font-serif text-muted-foreground mt-3 tracking-wide">
              Delivering insightful news and analysis
            </p>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-serif text-base font-semibold tracking-wide uppercase mb-6">{section.title}</h3>
              <ul className="space-y-3">
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

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <div className="mb-4 md:mb-0 font-serif">
              © {new Date().getFullYear()} The Bombay Forum. All Rights Reserved.
            </div>
            <div className="flex items-center space-x-6">
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