"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { news } from '../utilfunctions/interfaces';
import { formatDate } from '../utilfunctions/dateFormatter';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
    color: "#FFFFFF",
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  },
  disabled: {
    opacity: 0.5,
    cursor: "not-allowed"
  }
};

export function FourGridCarousel() {
  const [news, setNews] = useState<news[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/searcharticles?num=12&randomize=true`);
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
        setError('Failed to load news');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  if (error) {
    return (
      <div className="section-pattern-diagonal">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (isLoading || news.length === 0) {
    return (
      <div className="section-pattern-diagonal">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-xl mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-pattern-diagonal">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="flex items-center justify-between mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            className="text-2xl font-serif font-bold text-gray-900"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            Latest Updates
          </motion.h2>
          <div className="flex space-x-2">
            <motion.button 
              onClick={() => scroll('left')}
              className={`w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 ${!canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''}`}
              variants={buttonVariants}
              whileHover={canScrollLeft ? "hover" : "disabled"}
              whileTap={canScrollLeft ? "tap" : "disabled"}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>
            <motion.button 
              onClick={() => scroll('right')}
              className={`w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 ${!canScrollRight ? 'opacity-50 cursor-not-allowed' : ''}`}
              variants={buttonVariants}
              whileHover={canScrollRight ? "hover" : "disabled"}
              whileTap={canScrollRight ? "tap" : "disabled"}
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>

        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {news.map((item, index) => (
              <motion.div
                key={item.articleId}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                className="flex-none w-[300px]"
              >
                <Link href={`/view/${item.articleId}`} className="block group">
                  <motion.div 
                    className="overflow-hidden rounded-xl mb-3"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.img
                      src={item.lphoto}
                      alt={item.title}
                      className="w-full aspect-[3/4] object-cover transform group-hover:scale-105 transition-transform duration-700"
                      layoutId={`grid-${item.articleId}`}
                    />
                  </motion.div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-serif">
                        {item.type}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatDate(new Date(item.created_datetime || Date.now()))}
                      </span>
                    </div>
                    <motion.h3 
                      className="text-base font-medium group-hover:text-blue-500 transition-colors line-clamp-2"
                      layout
                    >
                      {item.title}
                    </motion.h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 