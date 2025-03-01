"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { news } from '../utilfunctions/interfaces';
import { formatDate } from '../utilfunctions/dateFormatter';
import { NewsGrid } from './NewsGrid';
import { MostView } from './MostView';
import { SocialStats } from './SocialStats';

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
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Trending News */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">Trending News</h2>
              <div className="flex space-x-1">
                <button 
                  onClick={prevPage}
                  className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
                <button 
                  onClick={nextPage}
                  className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/follow-us" className="text-lg font-bold">Follow Us</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {currentNews.map((item) => (
              <Link href={`/view/${item.articleId}`} key={item.articleId} className="group">
                <div className="flex gap-4">
                  <div className="w-[200px] aspect-[4/3] flex-shrink-0 overflow-hidden rounded">
                    <img
                      src={item.lphoto}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-blue-500 font-medium">
                        {item.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(new Date(item.created_datetime || Date.now()))}
                      </span>
                    </div>
                    <h3 className="text-base font-medium mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* News Grid */}
          <div className="bg-gray-50/50 p-6 rounded-lg">
            <NewsGrid />
          </div>
          <div className="bg-gray-50/50 p-6 rounded-lg">
            <NewsGrid />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Social Stats Section */}
          <div className="bg-white rounded-lg shadow-sm">
            <SocialStats />
          </div>

          {/* Most View Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <MostView />
          </div>
        </div>
      </div>
    </div>
  );
} 