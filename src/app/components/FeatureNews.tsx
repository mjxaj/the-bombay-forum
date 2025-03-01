"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { news } from '../utilfunctions/interfaces';
import { formatDate } from '../utilfunctions/dateFormatter';
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
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
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

export function FeatureNews() {
  const [featureNews, setFeatureNews] = useState<news[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchFeatureNews = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?num=8&randomize=true`
        );
        const data = await response.json();
        if (response.ok) {
          setFeatureNews(data);
        }
      } catch (error) {
        console.error('Failed to fetch feature news:', error);
      }
    };

    fetchFeatureNews();
  }, []);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % Math.ceil(featureNews.length / 4));
  };

  const prevPage = () => {
    setCurrentPage((prev) => 
      prev === 0 ? Math.ceil(featureNews.length / 4) - 1 : prev - 1
    );
  };

  const currentNews = featureNews.slice(currentPage * 4, (currentPage + 1) * 4);

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
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
          Feature News
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentNews.map((news, index) => (
            <motion.div
              key={news.articleId}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/view/${news.articleId}`} className="block group">
                <motion.div 
                  className="relative aspect-[4/3] overflow-hidden rounded-lg mb-0"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={news.lphoto}
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="absolute bottom-3 left-3 right-3"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center space-x-2 mb-1.5">
                        <motion.span 
                          className="text-[11px] font-medium text-white bg-blue-500 px-2 py-0.5 rounded"
                          whileHover={{ scale: 1.05 }}
                        >
                          {news.type}
                        </motion.span>
                        <span className="text-[11px] text-white/90">
                          {formatDate(new Date(news.created_datetime || Date.now()))}
                        </span>
                      </div>
                      <motion.h3 
                        className="text-sm text-white font-medium line-clamp-2 group-hover:text-blue-400 transition-colors"
                        whileHover={{ x: 2 }}
                      >
                        {news.title}
                      </motion.h3>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
} 