// components/NewsletterSubscription.tsx
"use client";

import { SendHorizontal } from "lucide-react";
import { useState } from "react";

export default function NewsletterSubscription() {
  const [email, setEmail] = useState("");

  const handleSubscription = () => {
    console.log("Subscribed with email:", email);
    // Add your subscription logic here
  };

  return (
    <div className="footer-subscription">
      <h2>Subscribe to our newsletter</h2>
      <div>
        <div className="input-wrapper">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <SendHorizontal onClick={handleSubscription} />
        </div>
      </div>
    </div>
  );
}
