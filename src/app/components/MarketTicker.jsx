"use client";

import { TrendingUp } from "lucide-react";

const MarketTicker = ({ data }) => {
  return (
    <div className="flex items-center space-x-2 overflow-hidden">
      <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
      <div className="whitespace-nowrap animate-marquee">
        {data}
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
