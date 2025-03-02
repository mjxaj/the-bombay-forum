"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { news } from '../utilfunctions/interfaces';
import { formatDate } from '../utilfunctions/dateFormatter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAutoRotate } from '../hooks/useAutoRotate';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export function BottomCarousel() {
  const [news, setNews] = useState<news[]>([]);
  const { currentIndex, currentItem, nextItem, prevItem } = useAutoRotate(news, 6000);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?num=4&randomize=true&sortBy=created_datetime&order=DESC`
        );
        const data = await response.json();
        if (response.ok) {
          setNews(data);
        }
      } catch (error) {
        console.error('Failed to fetch carousel news:', error);
      }
    };

    fetchNews();
  }, []);

  if (!news.length) return null;

  return (
    <motion.div 
      className="relative w-1/2"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
        variants={itemVariants}
      >
        <motion.button 
          onClick={prevItem}
          className="w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white shadow-md transition-colors"
          whileHover={{ scale: 1.05, backgroundColor: "#ffffff" }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="h-6 w-6" />
        </motion.button>
      </motion.div>

      <motion.div 
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
        variants={itemVariants}
      >
        <motion.button 
          onClick={nextItem}
          className="w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white shadow-md transition-colors"
          whileHover={{ scale: 1.05, backgroundColor: "#ffffff" }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="h-6 w-6" />
        </motion.button>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          {currentItem && (
            <Link href={`/view/${currentItem.articleId}`} className="block group">
              <motion.div 
                className="relative aspect-[21/9] overflow-hidden"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={currentItem.lphoto}
                  alt={currentItem.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 p-6 text-white"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <motion.span 
                      className="text-sm font-medium bg-blue-500 px-2 py-1 rounded"
                      whileHover={{ scale: 1.05 }}
                    >
                      {currentItem.type}
                    </motion.span>
                    <span className="text-sm opacity-90">
                      {formatDate(new Date(currentItem.created_datetime || Date.now()))}
                    </span>
                  </div>
                  <motion.h2 
                    className="text-2xl font-bold mb-2 line-clamp-2"
                    whileHover={{ x: 5 }}
                  >
                    {currentItem.title}
                  </motion.h2>
                  <motion.p 
                    className="text-base opacity-90 line-clamp-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.9 }}
                    transition={{ delay: 0.3 }}
                  >
                    {currentItem.description}
                  </motion.p>
                </motion.div>
              </motion.div>
            </Link>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
} 