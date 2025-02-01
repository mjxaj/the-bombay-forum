"use client";

import { TrendingUp } from "lucide-react";

const MarketTicker = ({ data }) => {
  return (
    <div className="relative flex items-center overflow-hidden bg-card">
      <div className="flex items-center space-x-2 flex-shrink-0">
        <TrendingUp className="h-4 w-4 text-primary" />
      </div>
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="mx-4">{data}</span>
        <span className="mx-4">{data}</span>
        <span className="mx-4">{data}</span>
        <span className="mx-4">{data}</span>
      </div>
    </div>
  );
};

export default MarketTicker;

// Add this to your globals.css
/*
@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-marquee {
  animation: marquee 20s linear infinite;
}
*/
