"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { news } from '../utilfunctions/interfaces';
import { formatDate } from '../utilfunctions/dateFormatter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAutoRotate } from '../hooks/useAutoRotate';
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
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3
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
  }
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 100 : -100,
    opacity: 0
  })
};

export function TrendingNews() {
  const [news, setNews] = useState<news[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState(0);
  const { currentIndex, nextItem: next, prevItem: prev } = useAutoRotate(news, 7000);

  const nextItem = () => {
    setDirection(1);
    next();
  };

  const prevItem = () => {
    setDirection(-1);
    prev();
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `/api/searcharticles?num=6&randomize=false&sortBy=created_datetime&order=DESC`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch trending news');
        }
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Failed to fetch trending news:', error);
        setError('Failed to load trending news');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (error) {
    return (
      <div className="section-divider-rose-amber">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (isLoading || news.length === 0) {
    return (
      <div className="section-divider-rose-amber">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-4">
                <div className="w-[200px] aspect-[4/3] bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentNews = news.slice(currentIndex * 2, (currentIndex * 2) + 2);

  return (
    <div className="section-divider-rose-amber">
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
            Trending News
          </motion.h2>
          <div className="flex space-x-2">
            <motion.button 
              onClick={prevItem}
              className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>
            <motion.button 
              onClick={nextItem}
              className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>

        <div className="relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div 
              key={currentIndex}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              {currentNews.map((item, index) => (
                <motion.div
                  key={item.articleId}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/view/${item.articleId}`} className="block group">
                    <motion.div 
                      className="flex gap-4 group-hover:bg-gray-50/80 p-3 rounded-lg transition-colors"
                      whileHover={{ x: 5, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                    >
                      <motion.div 
                        className="w-[200px] aspect-[4/3] overflow-hidden rounded-lg"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.img
                          src={item.lphoto}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          layoutId={`trending-${item.articleId}`}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="font-serif">
                            {item.type}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatDate(new Date(item.created_datetime || Date.now()))}
                          </span>
                        </div>
                        <motion.h3 
                          className="text-lg font-medium mb-2 group-hover:text-blue-500 transition-colors line-clamp-2"
                          layout
                        >
                          {item.title}
                        </motion.h3>
                        <motion.p 
                          className="text-sm text-gray-600 line-clamp-2"
                          layout
                        >
                          {item.description}
                        </motion.p>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 