"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { news } from '../utilfunctions/interfaces';
import { formatDate } from '../utilfunctions/dateFormatter';

export function SportsNews() {
  const [news, setNews] = useState<news[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?num=6&randomize=true&type=Sports`
        );
        const data = await response.json();
        if (response.ok) {
          setNews(data);
        }
      } catch (error) {
        console.error('Failed to fetch sports news:', error);
      }
    };

    fetchNews();
  }, []);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % Math.ceil(news.length / 5));
  };

  const prevPage = () => {
    setCurrentPage((prev) => 
      prev === 0 ? Math.ceil(news.length / 5) - 1 : prev - 1
    );
  };

  const mainArticle = news[0];
  const listArticles = news.slice(1);

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Sports News</h2>
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

      {mainArticle && (
        <Link href={`/view/${mainArticle.articleId}`} className="group block mb-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
            <img
              src={mainArticle.lphoto}
              alt={mainArticle.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-blue-500 font-medium">
                {mainArticle.type}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(new Date(mainArticle.created_datetime || Date.now()))}
              </span>
            </div>
            <h3 className="text-lg font-medium mb-2 group-hover:text-blue-500 transition-colors">
              {mainArticle.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {mainArticle.description}
            </p>
          </div>
        </Link>
      )}

      <div className="space-y-4">
        {listArticles.map((item) => (
          <Link href={`/view/${item.articleId}`} key={item.articleId} className="group">
            <div className="flex gap-4">
              <div className="w-24 h-20 flex-shrink-0 overflow-hidden rounded">
                <img
                  src={item.sphoto}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-blue-500 font-medium">
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 