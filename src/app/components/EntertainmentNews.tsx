"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { news } from '../utilfunctions/interfaces';
import { formatDate } from '../utilfunctions/dateFormatter';

export function EntertainmentNews() {
  const [news, setNews] = useState<news[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?num=6&randomize=true&type=Entertainment`
        );
        const data = await response.json();
        if (response.ok) {
          setNews(data);
        }
      } catch (error) {
        console.error('Failed to fetch entertainment news:', error);
      }
    };

    fetchNews();
  }, []);

  const mainArticles = news.slice(0, 2);
  const gridArticles = news.slice(2);

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Entertainment News</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {mainArticles.map((item) => (
          <Link href={`/view/${item.articleId}`} key={item.articleId} className="group">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
              <img
                src={item.lphoto}
                alt={item.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-blue-500 font-medium">
                  {item.type}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(new Date(item.created_datetime || Date.now()))}
                </span>
              </div>
              <h3 className="text-lg font-medium mb-2 group-hover:text-blue-500 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gridArticles.map((item) => (
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