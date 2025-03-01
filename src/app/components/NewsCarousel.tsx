"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { news } from '../utilfunctions/interfaces';
import { formatDate } from '../utilfunctions/dateFormatter';

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
    <div className="container mx-auto px-4 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Featured Article */}
        {mainNews && (
          <div className="lg:col-span-8 relative group">
            <Link href={`/view/${mainNews.articleId}`}>
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <img 
                  src={mainNews.lphoto} 
                  alt={mainNews.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <button className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-all duration-300">
                      <Play className="h-6 w-6 text-white fill-current ml-1" />
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-xs font-medium text-white bg-blue-500 px-2.5 py-1 rounded">
                      {mainNews.type}
                    </span>
                    <span className="text-xs text-white/90">
                      {formatDate(new Date(mainNews.created_datetime || Date.now()))}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {mainNews.title}
                  </h2>
                  <p className="text-sm text-white/80 line-clamp-2 max-w-3xl">
                    {mainNews.description}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Right Side News */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              {['TRENDY', 'LATEST', 'POPULAR'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 text-xs font-semibold tracking-wide ${
                    activeTab === tab
                      ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-50/50'
                      : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* News List */}
            <div className="divide-y divide-gray-100">
              {sideNews.map((news) => (
                <Link href={`/view/${news.articleId}`} key={news.articleId}>
                  <div className="flex p-3 gap-3 hover:bg-gray-50/80 transition-colors">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={news.sphoto}
                        alt={news.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] text-blue-500 font-medium">
                          {news.type}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {formatDate(new Date(news.created_datetime || Date.now()))}
                        </span>
                      </div>
                      <h3 className="text-sm font-medium line-clamp-2 text-gray-900 hover:text-blue-500 transition-colors">
                        {news.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 