"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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

interface CategoryNewsCarouselProps {
  title: string;
  articles?: news[];
  categorySlug: string;
}

export function CategoryNewsCarousel({ title, articles = [], categorySlug }: CategoryNewsCarouselProps) {
  const { currentIndex } = useAutoRotate(articles, 6000);
  const displayArticles = articles?.slice?.(0, 5) || [];
  const featuredArticle = displayArticles[0];

  if (!articles || articles.length === 0) {
    return (
      <div className="bg-pattern-honeycomb">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-6 mx-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900">{title}</h2>
            <Link 
              href={`/category/${categorySlug}`} 
              className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="animate-pulse space-y-4">
            {/* Loading skeleton */}
            <div className="aspect-[16/9] bg-gray-200 rounded-lg" />
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-24 h-20 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pattern-honeycomb">
      <motion.div 
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-6 mx-4 hover:shadow-md transition-shadow"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="flex items-center justify-between mb-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-serif font-bold text-gray-900">{title}</h2>
          <Link 
            href={`/category/${categorySlug}`} 
            className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {displayArticles.map((item, index) => (
              <motion.div
                key={item.articleId}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                style={{
                  opacity: index === currentIndex ? 1 : 0.7,
                  transform: `scale(${index === currentIndex ? 1 : 0.98})`,
                  transition: 'all 0.3s ease'
                }}
              >
                <Link href={`/view/${item.articleId}`} className="group">
                  {index === 0 ? (
                    // Featured item with larger image
                    <div className="mb-6">
                      <motion.div 
                        className="aspect-[16/9] rounded-lg overflow-hidden mb-4"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={item.lphoto}
                          alt={item.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                      </motion.div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="font-serif">
                          {item.type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(new Date(item.created_datetime || Date.now()))}
                        </span>
                      </div>
                      <motion.h3 
                        className="text-lg font-medium line-clamp-2 group-hover:text-blue-500 transition-colors"
                        whileHover={{ x: 2 }}
                      >
                        {item.title}
                      </motion.h3>
                    </div>
                  ) : (
                    // List items
                    <motion.div 
                      className="flex gap-4 group-hover:bg-gray-50/80 p-3 rounded-lg transition-colors"
                      whileHover={{ x: 5, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                    >
                      <motion.div 
                        className="w-24 h-20 flex-shrink-0 overflow-hidden rounded-lg"
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
                    </motion.div>
                  )}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 