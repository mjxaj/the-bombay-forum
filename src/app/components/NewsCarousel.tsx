"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
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
  const [mainNews, setMainNews] = useState<news | null>(null);
  const [sideNews, setSideNews] = useState<news[]>([]);
  
  useEffect(() => {
    const fetchMainNews = async () => {
      try {
        const response = await fetch('/api/searcharticles?num=1&randomize=false');
        const data = await response.json();
        if (response.ok && data.length > 0) {
          setMainNews(data[0]);
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
      }
    };

    fetchMainNews();
    fetchSideNews();
  }, []);

  return (
    <motion.div 
      className="container mx-auto px-4 py-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Featured Article */}
        {mainNews && (
          <motion.div 
            className="lg:col-span-8 relative group"
            variants={itemVariants}
          >
            <Link href={`/view/${mainNews.articleId}`}>
              <motion.div 
                className="relative aspect-video overflow-hidden rounded-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={mainNews.lphoto} 
                  alt={mainNews.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <motion.div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-all duration-300">
                      <Play className="h-6 w-6 text-white fill-current ml-1" />
                    </button>
                  </motion.div>
                </div>
                <motion.div 
                  className="absolute bottom-6 left-6 right-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <motion.span 
                      className="text-xs font-medium text-white bg-blue-500 px-2.5 py-1 rounded"
                      whileHover={{ scale: 1.05 }}
                    >
                      {mainNews.type}
                    </motion.span>
                    <span className="text-xs text-white/90">
                      {formatDate(new Date(mainNews.created_datetime || Date.now()))}
                    </span>
                  </div>
                  <motion.h2 
                    className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {mainNews.title}
                  </motion.h2>
                  <motion.p 
                    className="text-sm text-white/80 line-clamp-2 max-w-3xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {mainNews.description}
                  </motion.p>
                </motion.div>
              </motion.div>
            </Link>
          </motion.div>
        )}

        {/* Right Side News */}
        <motion.div 
          className="lg:col-span-4"
          variants={itemVariants}
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {sideNews.map((news, index) => (
                  <motion.div
                    key={news.articleId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/view/${news.articleId}`}>
                      <motion.div 
                        className="flex p-3 gap-3 hover:bg-gray-50/80 transition-colors"
                        whileHover={{ x: 5, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                      >
                        <motion.div 
                          className="w-20 h-20 flex-shrink-0"
                          whileHover={{ scale: 1.05 }}
                        >
                          <img
                            src={news.sphoto}
                            alt={news.title}
                            className="w-full h-full object-cover rounded"
                          />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <motion.span 
                              className="text-[11px] text-blue-500 font-medium"
                              whileHover={{ scale: 1.05 }}
                            >
                              {news.type}
                            </motion.span>
                            <span className="text-[11px] text-gray-500">
                              {formatDate(new Date(news.created_datetime || Date.now()))}
                            </span>
                          </div>
                          <motion.h3 
                            className="text-sm font-medium line-clamp-2 text-gray-900 hover:text-blue-500 transition-colors"
                            whileHover={{ x: 2 }}
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
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 