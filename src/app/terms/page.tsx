"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TermsAndConditions() {
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
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">Terms and Conditions</h1>
            
            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-xl font-serif font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p className="leading-relaxed">
                  By accessing and using The Bombay Forum website, you accept and agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please do not use our website.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-serif font-semibold text-foreground mb-4">2. User Registration</h2>
                <p className="leading-relaxed">
                  To access certain features of our website, you may need to register for an account. You agree to:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Promptly update your account information</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-serif font-semibold text-foreground mb-4">3. Content and Copyright</h2>
                <p className="leading-relaxed">
                  All content on The Bombay Forum is protected by copyright and other intellectual property laws. You may not:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Reproduce, distribute, or modify any content without permission</li>
                  <li>Use our content for commercial purposes without authorization</li>
                  <li>Remove any copyright or proprietary notices</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-serif font-semibold text-foreground mb-4">4. User Conduct</h2>
                <p className="leading-relaxed">
                  When using our website, you agree not to:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Post or transmit harmful or malicious content</li>
                  <li>Impersonate others or misrepresent your affiliation</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Interfere with the website's operation</li>
                  <li>Collect user information without consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-serif font-semibold text-foreground mb-4">5. Subscriptions and Payments</h2>
                <p className="leading-relaxed">
                  For paid subscriptions:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Payments are processed securely through our payment providers</li>
                  <li>Subscriptions auto-renew unless cancelled</li>
                  <li>Refunds are subject to our refund policy</li>
                  <li>Prices may change with notice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-serif font-semibold text-foreground mb-4">6. Disclaimer of Warranties</h2>
                <p className="leading-relaxed">
                  The Bombay Forum provides content "as is" without any warranties, express or implied. We do not guarantee the accuracy, completeness, or reliability of any content.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-serif font-semibold text-foreground mb-4">7. Limitation of Liability</h2>
                <p className="leading-relaxed">
                  The Bombay Forum shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-serif font-semibold text-foreground mb-4">8. Modifications</h2>
                <p className="leading-relaxed">
                  We reserve the right to modify these Terms and Conditions at any time. Continued use of the website after changes constitutes acceptance of the modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-serif font-semibold text-foreground mb-4">9. Contact Information</h2>
                <p className="leading-relaxed">
                  For questions about these Terms and Conditions, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="font-medium text-foreground">The Bombay Forum</p>
                  <p>Email: legal@bombayforum.com</p>
                  <p>Address: Mumbai, India</p>
                </div>
              </section>

              <section className="pt-4 border-t border-border">
                <p className="text-sm">
                  By using The Bombay Forum, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
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