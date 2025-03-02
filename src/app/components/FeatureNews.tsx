"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
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

export function FeatureNews() {
  const [featureNews, setFeatureNews] = useState<news[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState(0);
  const { currentIndex, nextItem: next, prevItem: prev } = useAutoRotate(featureNews, 6500);

  const nextItem = () => {
    setDirection(1);
    next();
  };

  const prevItem = () => {
    setDirection(-1);
    prev();
  };

  useEffect(() => {
    const fetchFeatureNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/searcharticles?num=5&randomize=true`);
        if (!response.ok) {
          throw new Error('Failed to fetch feature news');
        }
        const data = await response.json();
        setFeatureNews(data);
      } catch (error) {
        console.error('Failed to fetch feature news:', error);
        setError('Failed to load feature news');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatureNews();
  }, []);

  if (error) {
    return (
      <div className="section-divider-blue-purple">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (isLoading || featureNews.length === 0) {
    return (
      <div className="section-divider-blue-purple">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-6">
            <div className="w-2/3 animate-pulse">
              <div className="aspect-[16/9] bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-1/3 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4">
                  <div className="w-24 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const featuredArticle = featureNews[currentIndex];
  const sideArticles = featureNews.filter((_, idx) => idx !== currentIndex);

  return (
    <div className="section-divider-blue-purple">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="flex items-center justify-between mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-4">
            <motion.h2 
              className="text-2xl font-serif font-bold text-gray-900"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              Featured Stories
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
          </div>
          <Link 
            href="/category/featured" 
            className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div 
              key={currentIndex}
              className="flex gap-6"
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
              {/* Featured Article */}
              <motion.div 
                className="w-2/3"
                layout
              >
                <Link href={`/view/${featuredArticle.articleId}`} className="group block">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-xl mb-4">
                    <motion.img
                      src={featuredArticle.lphoto}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover"
                      layoutId={`image-${featuredArticle.articleId}`}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <motion.div layout>
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="outline" className="font-serif">
                        {featuredArticle.type}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formatDate(new Date(featuredArticle.created_datetime || Date.now()))}
                      </span>
                    </div>
                    <motion.h3 
                      className="text-2xl font-serif font-bold mb-2 group-hover:text-blue-500 transition-colors line-clamp-2"
                      layout
                    >
                      {featuredArticle.title}
                    </motion.h3>
                    <motion.p 
                      className="text-gray-600 line-clamp-2"
                      layout
                    >
                      {featuredArticle.description}
                    </motion.p>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Side Articles */}
              <motion.div 
                className="w-1/3 space-y-4"
                layout
              >
                {sideArticles.slice(0, 3).map((article, index) => (
                  <motion.div
                    key={article.articleId}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/view/${article.articleId}`} className="group">
                      <motion.div 
                        className="flex gap-4 group-hover:bg-gray-50/80 p-3 rounded-lg transition-colors"
                        whileHover={{ x: 5, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                      >
                        <motion.div 
                          className="w-24 h-20 flex-shrink-0 overflow-hidden rounded-lg"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.img
                            src={article.sphoto}
                            alt={article.title}
                            className="w-full h-full object-cover"
                            layoutId={`image-${article.articleId}`}
                            transition={{ duration: 0.3 }}
                          />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <motion.span 
                              className="text-xs text-blue-500 font-medium"
                              whileHover={{ scale: 1.05 }}
                            >
                              {article.type}
                            </motion.span>
                            <span className="text-xs text-gray-500">
                              {formatDate(new Date(article.created_datetime || Date.now()))}
                            </span>
                          </div>
                          <motion.h3 
                            className="text-sm font-medium line-clamp-2 group-hover:text-blue-500 transition-colors"
                            layout
                          >
                            {article.title}
                          </motion.h3>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 