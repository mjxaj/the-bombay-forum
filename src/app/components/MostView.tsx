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

export function MostView() {
  const [news, setNews] = useState<news[]>([]);
  const { currentIndex, nextItem, prevItem } = useAutoRotate(news, 8000);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?num=6&randomize=false&sortBy=created_datetime&order=DESC`
        );
        const data = await response.json();
        if (response.ok) {
          setNews(data);
        }
      } catch (error) {
        console.error('Failed to fetch most viewed news:', error);
      }
    };

    fetchNews();
  }, []);

  const currentNews = news.slice(currentIndex * 6, (currentIndex * 6) + 6);

  return (
    <motion.div 
      className="p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2 
        className="text-lg font-bold text-gray-900 mb-6"
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        Most Viewed
      </motion.h2>

      <motion.div 
        className="flex items-center justify-between mb-6"
        variants={containerVariants}
      >
        <div className="flex space-x-1">
          <motion.button 
            onClick={prevItem}
            className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="h-3 w-3" />
          </motion.button>
          <motion.button 
            onClick={nextItem}
            className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="h-3 w-3" />
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          className="divide-y divide-gray-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          variants={containerVariants}
        >
          {currentNews.map((item, index) => (
            <motion.div
              key={item.articleId}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/view/${item.articleId}`} className="group">
                <motion.div 
                  className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="w-20 h-16 flex-shrink-0 overflow-hidden rounded"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={item.sphoto}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <motion.span 
                        className="text-xs text-blue-500 font-medium"
                        whileHover={{ scale: 1.05 }}
                      >
                        {item.type}
                      </motion.span>
                      <span className="text-xs text-gray-500">
                        {formatDate(new Date(item.created_datetime || Date.now()))}
                      </span>
                    </div>
                    <motion.h3 
                      className="text-sm font-medium line-clamp-2 group-hover:text-blue-500 transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      {item.title}
                    </motion.h3>
                  </div>
                  <div className="text-2xl font-bold text-gray-200 flex-shrink-0 w-8 text-right">
                    {index + 1}
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
} 