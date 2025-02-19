"use client";

import Link from "next/link";
import { ChevronLeft, ArrowRight, BarChart, Users, Globe, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const adProducts = [
  {
    title: "Premium Display",
    description: "High-impact display advertising across our digital platforms",
    features: [
      "Premium positioning",
      "Rich media formats",
      "Responsive design",
      "Viewability guarantee"
    ],
    icon: Globe,
    metrics: {
      impressions: "2M+",
      engagement: "3.2%",
      audience: "Elite professionals"
    }
  },
  {
    title: "Native Content",
    description: "Seamlessly integrated sponsored content that resonates with our audience",
    features: [
      "Editorial collaboration",
      "Multi-platform distribution",
      "Social media amplification",
      "Performance analytics"
    ],
    icon: Newspaper,
    metrics: {
      readTime: "4.5 min avg",
      engagement: "5.8%",
      shareRate: "12%"
    }
  },
  {
    title: "Audience Targeting",
    description: "Precision targeting to reach your ideal audience segments",
    features: [
      "Demographic targeting",
      "Behavioral segmentation",
      "Industry verticals",
      "Custom audiences"
    ],
    icon: Users,
    metrics: {
      accuracy: "95%",
      conversion: "2.8%",
      reach: "1.5M+"
    }
  }
];

const statistics = [
  { label: "Monthly Page Views", value: "12M+" },
  { label: "Unique Visitors", value: "3.5M+" },
  { label: "Average Time on Site", value: "6.5 min" },
  { label: "Newsletter Subscribers", value: "850K+" }
];

export default function Advertise() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Button>
          </Link>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
              Advertise with The Bombay Forum
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-serif max-w-3xl mx-auto">
              Connect with India's most influential audience through premium advertising solutions
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {statistics.map((stat, index) => (
              <Card key={index} className="p-6 text-center bg-card/50 backdrop-blur border shadow-sm">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Ad Products Section */}
          <div className="space-y-12 mb-16">
            <h2 className="text-3xl font-serif font-bold text-center mb-12">Advertising Solutions</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {adProducts.map((product, index) => (
                <Card key={index} className="p-8 bg-card border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <product.icon className="h-8 w-8 text-primary" />
                    <div className="text-sm font-medium text-muted-foreground">Premium</div>
                  </div>
                  
                  <h3 className="text-xl font-serif font-bold mb-3">{product.title}</h3>
                  <p className="text-muted-foreground mb-6">{product.description}</p>
                  
                  <ul className="space-y-3 mb-6">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-6 border-t border-border">
                    <div className="space-y-2">
                      {Object.entries(product.metrics).map(([key, value], i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-muted-foreground capitalize">{key}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Why Advertise Section */}
          <Card className="p-12 bg-primary/5 border-none shadow-none mb-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold mb-8">Why Advertise with Us?</h2>
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <BarChart className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="text-lg font-serif font-semibold">Premium Audience</h3>
                  <p className="text-muted-foreground">
                    Reach India's most influential business leaders, professionals, and decision-makers
                  </p>
                </div>
                <div className="space-y-4">
                  <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="text-lg font-serif font-semibold">Brand Safety</h3>
                  <p className="text-muted-foreground">
                    Your brand alongside our trusted, premium journalism and content
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Section */}
          <Card className="p-8 md:p-12 bg-card border shadow-sm">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold mb-6">Get in Touch</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Let's create a customized advertising solution for your brand
              </p>
              <Button size="lg" className="font-medium">
                Contact Our Ad Team
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              
              <div className="mt-12 pt-8 border-t border-border text-sm text-muted-foreground">
                <p className="font-medium mb-2">The Bombay Forum Advertising</p>
                <p>Email: advertising@bombayforum.com</p>
                <p>Phone: +91 (22) XXXX-XXXX</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
} 