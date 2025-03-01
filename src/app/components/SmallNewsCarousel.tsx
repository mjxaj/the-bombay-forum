"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { news } from '../utilfunctions/interfaces';
import { formatDate } from '../utilfunctions/dateFormatter';

export function SmallNewsCarousel() {
  const [news, setNews] = useState<news[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?num=3&randomize=false&sortBy=created_datetime&order=DESC`
        );
        const data = await response.json();
        if (response.ok) {
          setNews(data);
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {news.map((item) => (
          <Link href={`/view/${item.articleId}`} key={item.articleId} className="flex-none group">
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 pr-8 min-w-[400px] hover:bg-gray-100/80 transition-colors">
              <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded">
                <img
                  src={item.sphoto}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] text-blue-500 font-medium">
                    {item.type}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {formatDate(new Date(item.created_datetime || Date.now()))}
                  </span>
                </div>
                <h3 className="text-sm font-medium line-clamp-2 text-gray-900 group-hover:text-blue-500 transition-colors">
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