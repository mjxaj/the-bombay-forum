"use client";

import { useState, useEffect } from 'react';

export function useAutoRotate(items: any[], interval: number = 5000) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!items.length) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [items.length, interval]);

  const nextItem = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevItem = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? items.length - 1 : prev - 1
    );
  };

  return {
    currentIndex,
    currentItem: items[currentIndex],
    nextItem,
    prevItem,
    setCurrentIndex
  };
} 