// components/NewsletterSubscription.tsx
"use client";

import { SendHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterSubscription() {
  const [email, setEmail] = useState("");

  const handleSubscription = () => {
    console.log("Subscribed with email:", email);
    // Add your subscription logic here
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Subscribe to our newsletter</h2>
      <div className="flex space-x-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-transparent border-gray-700 text-white placeholder:text-gray-400"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSubscription}
          className="text-white hover:text-gray-300"
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
