"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Button>
          </Link>

          <Card className="p-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">Privacy Policy</h1>
            
            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-xl font-serif font-semibold text-foreground mb-4">Information We Collect</h2>
                <p className="leading-relaxed">
                  We collect information that you provide directly to us, including when you create an account, subscribe to our newsletter, or contact us for support. This may include:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Name and contact information</li>
                  <li>Account credentials</li>
                  <li>Payment information</li>
                  <li>Communication preferences</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-serif font-semibold text-foreground mb-4">How We Use Your Information</h2>
                <p className="leading-relaxed">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process your subscriptions and transactions</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Communicate with you about products, services, and events</li>
                  <li>Monitor and analyze trends and usage</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-serif font-semibold text-foreground mb-4">Information Sharing</h2>
                <p className="leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information with:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Service providers who assist in our operations</li>
                  <li>Professional advisers and insurers</li>
                  <li>Law enforcement or regulatory bodies when required</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-serif font-semibold text-foreground mb-4">Data Security</h2>
                <p className="leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-serif font-semibold text-foreground mb-4">Your Rights</h2>
                <p className="leading-relaxed">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to data processing</li>
                  <li>Data portability</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-serif font-semibold text-foreground mb-4">Cookies and Tracking</h2>
                <p className="leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-serif font-semibold text-foreground mb-4">Contact Us</h2>
                <p className="leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="font-medium text-foreground">The Bombay Forum</p>
                  <p>Email: privacy@bombayforum.com</p>
                  <p>Address: Mumbai, India</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-serif font-semibold text-foreground mb-4">Updates to This Policy</h2>
                <p className="leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
                <p className="mt-4 text-sm">Last Updated: {new Date().toLocaleDateString()}</p>
              </section>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
} 