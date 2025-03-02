"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
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

export function LatestUpdatesCarousel() {
  const [news, setNews] = useState<news[]>([]);
  const { currentIndex, currentItem } = useAutoRotate(news, 5000);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?num=4&randomize=true`
        );
        const data = await response.json();
        if (response.ok) {
          setNews(data);
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <motion.div 
      className="flex-1"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="bg-white rounded-lg shadow-sm p-6"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h2 
          className="text-lg font-bold text-gray-900 mb-6"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          Latest Updates
        </motion.h2>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {news.map((item, index) => (
              <motion.div
                key={item.articleId}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                style={{
                  opacity: index === currentIndex ? 1 : 0.5,
                  transform: `scale(${index === currentIndex ? 1 : 0.98})`,
                  transition: 'all 0.3s ease'
                }}
              >
                <Link href={`/view/${item.articleId}`} className="block group">
                  <motion.div 
                    className="flex gap-4"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div 
                      className="w-20 h-20 flex-shrink-0 overflow-hidden rounded"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={item.sphoto}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <motion.span 
                          className="text-[11px] text-blue-500 font-medium"
                          whileHover={{ scale: 1.05 }}
                        >
                          {item.type}
                        </motion.span>
                        <span className="text-[11px] text-gray-500">
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
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
} 