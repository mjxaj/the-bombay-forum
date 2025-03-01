"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { news } from '../utilfunctions/interfaces';
import { formatDate } from '../utilfunctions/dateFormatter';

export function NewsGrid() {
  const [news, setNews] = useState<news[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?num=6&randomize=true`
        );
        const data = await response.json();
        if (response.ok) {
          setNews(data);
        }
      } catch (error) {
        console.error('Failed to fetch grid news:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {news.map((item) => (
        <Link href={`/view/${item.articleId}`} key={item.articleId} className="group">
          <div className="flex gap-4 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-28 h-20 flex-shrink-0 overflow-hidden rounded">
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
  );
} 