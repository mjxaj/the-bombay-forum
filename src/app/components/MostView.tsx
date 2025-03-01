"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { news } from '../utilfunctions/interfaces';
import { formatDate } from '../utilfunctions/dateFormatter';

export function MostView() {
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
        console.error('Failed to fetch most viewed news:', error);
      }
    };

    fetchNews();
  }, []);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % Math.ceil(news.length / 6));
  };

  const prevPage = () => {
    setCurrentPage((prev) => 
      prev === 0 ? Math.ceil(news.length / 6) - 1 : prev - 1
    );
  };

  const currentNews = news.slice(currentPage * 6, (currentPage + 1) * 6);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Most View</h2>
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

      <div className="divide-y divide-gray-100">
        {currentNews.map((item, index) => (
          <Link href={`/view/${item.articleId}`} key={item.articleId} className="group">
            <div className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
              <div className="w-20 h-16 flex-shrink-0 overflow-hidden rounded">
                <img
                  src={item.sphoto}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-blue-500">
                    {item.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(new Date(item.created_datetime || Date.now()))}
                  </span>
                </div>
                <h3 className="text-sm font-medium line-clamp-2 group-hover:text-blue-500 transition-colors">
                  {item.title}
                </h3>
              </div>
              <div className="text-2xl font-bold text-gray-200 flex-shrink-0 w-8 text-right">
                {index + 1}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 