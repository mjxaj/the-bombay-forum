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
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const imageVariants = {
  initial: { scale: 1.2, opacity: 0 },
  animate: { 
    scale: 1,
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: "easeOut"
    }
  },
  exit: { 
    scale: 0.95,
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: "easeIn"
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 1,
      ease: "easeInOut"
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: {
      duration: 0.4,
      ease: "easeIn"
    }
  }
};

const sideNewsVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  }),
  hover: {
    x: 10,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

const tabVariants = {
  active: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    color: "#3B82F6",
    borderColor: "#3B82F6",
    transition: { duration: 0.2 }
  },
  inactive: {
    backgroundColor: "transparent",
    color: "#4B5563",
    borderColor: "transparent",
    transition: { duration: 0.2 }
  }
};

export function NewsCarousel() {
  const [activeTab, setActiveTab] = useState('TRENDY');
  const [mainNews, setMainNews] = useState<news[]>([]);
  const [sideNews, setSideNews] = useState<news[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentIndex, currentItem } = useAutoRotate(mainNews, 5000);
  
  useEffect(() => {
    const fetchMainNews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/searcharticles?num=4&randomize=false');
        const data = await response.json();
        if (response.ok) {
          setMainNews(data);
        }
      } catch (error) {
        console.error('Failed to fetch main news:', error);
      }
    };

    const fetchSideNews = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?num=5&randomize=false&sortBy=created_datetime&order=DESC`
        );
        const data = await response.json();
        if (response.ok) {
          setSideNews(data);
        }
      } catch (error) {
        console.error('Failed to fetch side news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMainNews();
    fetchSideNews();
  }, []);

  if (isLoading || !currentItem) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="aspect-video bg-gray-100 animate-pulse rounded-lg" />
          </div>
          <div className="lg:col-span-4">
            <div className="bg-gray-100 rounded-lg h-[400px] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto px-4 py-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Featured Article */}
        <motion.div 
          className="lg:col-span-8 relative group"
          variants={itemVariants}
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentItem?.articleId}
              className="relative aspect-video overflow-hidden rounded-lg"
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover="hover"
            >
              <Link href={`/view/${currentItem.articleId}`}>
                <motion.img 
                  src={currentItem.lphoto} 
                  alt={currentItem.title}
                  className="w-full h-full object-cover"
                  variants={imageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                />
                <motion.div 
                  className="absolute bottom-6 left-6 right-6"
                  variants={contentVariants}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <motion.span 
                      className="text-xs font-medium text-white bg-blue-500 px-2.5 py-1 rounded"
                      whileHover={{ scale: 1.05, backgroundColor: "#2563EB" }}
                      transition={{ duration: 0.2 }}
                    >
                      {currentItem.type}
                    </motion.span>
                    <motion.span 
                      className="text-xs text-white/90"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {formatDate(new Date(currentItem.created_datetime || Date.now()))}
                    </motion.span>
                  </div>
                  <motion.h2 
                    className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    {currentItem.title}
                  </motion.h2>
                  <motion.p 
                    className="text-sm text-white/80 line-clamp-2 max-w-3xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    {currentItem.description}
                  </motion.p>
                </motion.div>
              </Link>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Right Side News */}
        <motion.div 
          className="lg:col-span-4"
          variants={itemVariants}
        >
          <motion.div 
            className="bg-white rounded-lg shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              {['TRENDY', 'LATEST', 'POPULAR'].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 text-xs font-semibold tracking-wide`}
                  variants={tabVariants}
                  animate={activeTab === tab ? "active" : "inactive"}
                  whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tab}
                </motion.button>
              ))}
            </div>

            {/* News List */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                className="overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {sideNews.map((news, index) => (
                  <motion.div
                    key={news.articleId}
                    custom={index}
                    variants={sideNewsVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                  >
                    <Link href={`/view/${news.articleId}`}>
                      <motion.div 
                        className="flex p-3 gap-3 hover:bg-gray-50/80 transition-colors"
                        whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                      >
                        <motion.div 
                          className="w-20 h-20 flex-shrink-0 overflow-hidden rounded"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.img
                            src={news.sphoto}
                            alt={news.title}
                            className="w-full h-full object-cover"
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                          />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <motion.div 
                            className="flex items-center gap-2 mb-1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                          >
                            <motion.span 
                              className="text-[11px] text-blue-500 font-medium"
                              whileHover={{ scale: 1.05 }}
                            >
                              {news.type}
                            </motion.span>
                            <span className="text-[11px] text-gray-500">
                              {formatDate(new Date(news.created_datetime || Date.now()))}
                            </span>
                          </motion.div>
                          <motion.h3 
                            className="text-sm font-medium line-clamp-2 text-gray-900 group-hover:text-blue-500"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                          >
                            {news.title}
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
      </div>
    </motion.div>
  );
} 