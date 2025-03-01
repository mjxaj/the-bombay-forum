"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { news } from '../utilfunctions/interfaces';
import { formatDate } from '../utilfunctions/dateFormatter';

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Feature News</h2>
        <div className="flex space-x-2">
          <button 
            onClick={prevPage}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button 
            onClick={nextPage}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {currentNews.map((news) => (
          <Link href={`/view/${news.articleId}`} key={news.articleId} className="group">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-0">
              <img
                src={news.lphoto}
                alt={news.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="text-[11px] font-medium text-white bg-blue-500 px-2 py-0.5 rounded">
                      {news.type}
                    </span>
                    <span className="text-[11px] text-white/90">
                      {formatDate(new Date(news.created_datetime || Date.now()))}
                    </span>
                  </div>
                  <h3 className="text-sm text-white font-medium line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {news.title}
                  </h3>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 