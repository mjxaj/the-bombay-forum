"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { news } from '../utilfunctions/interfaces';
import { formatDate } from '../utilfunctions/dateFormatter';
import { NewsGrid } from './NewsGrid';
import { MostView } from './MostView';
import { SocialStats } from './SocialStats';
import { motion, AnimatePresence } from 'framer-motion';

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

const buttonVariants = {
  hover: {
    scale: 1.1,
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
    color: "#FFFFFF",
  },
  tap: {
    scale: 0.95
  }
};

export function TrendingNews() {
  const [news, setNews] = useState<news[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

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
        console.error('Failed to fetch trending news:', error);
      }
    };

    fetchNews();
  }, []);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % Math.ceil(news.length / 2));
  };

  const prevPage = () => {
    setCurrentPage((prev) => 
      prev === 0 ? Math.ceil(news.length / 2) - 1 : prev - 1
    );
  };

  const currentNews = news.slice(currentPage * 2, (currentPage + 1) * 2);

  return (
    <motion.div 
      className="container mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="flex items-center justify-between mb-6"
        variants={itemVariants}
      >
        <motion.h2 
          className="text-xl font-bold text-gray-900"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          Trending News
        </motion.h2>
        <div className="flex space-x-2">
          <motion.button 
            onClick={prevPage}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
          <motion.button 
            onClick={nextPage}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentPage}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentNews.map((item, index) => (
            <motion.div
              key={item.articleId}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/view/${item.articleId}`} className="block group">
                <motion.div 
                  className="flex gap-4"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="w-[200px] aspect-[4/3] overflow-hidden rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={item.lphoto}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
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
                      className="text-lg font-medium mb-2 group-hover:text-blue-500 transition-colors line-clamp-2"
                      whileHover={{ x: 2 }}
                    >
                      {item.title}
                    </motion.h3>
                    <motion.p 
                      className="text-sm text-gray-600 line-clamp-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
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
    </motion.div>
  );
} 