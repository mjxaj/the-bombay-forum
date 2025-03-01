import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { news } from '../utilfunctions/interfaces';
import { formatDate } from '../utilfunctions/dateFormatter';

export function BottomCarousel() {
  const [news, setNews] = useState<news[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?num=4&randomize=true&sortBy=created_datetime&order=DESC`
        );
        const data = await response.json();
        if (response.ok) {
          setNews(data);
        }
      } catch (error) {
        console.error('Failed to fetch carousel news:', error);
      }
    };

    fetchNews();
  }, []);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % news.length);
  };

  const prevPage = () => {
    setCurrentPage((prev) => 
      prev === 0 ? news.length - 1 : prev - 1
    );
  };

  if (!news.length) return null;

  const currentArticle = news[currentPage];

  return (
    <div className="relative w-1/2">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <button 
          onClick={prevPage}
          className="w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white shadow-md transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>
      
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <button 
          onClick={nextPage}
          className="w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white shadow-md transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <Link href={`/view/${currentArticle.articleId}`} className="block group">
        <div className="relative aspect-[21/9] overflow-hidden">
          <img
            src={currentArticle.lphoto}
            alt={currentArticle.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-medium bg-blue-500 px-2 py-1 rounded">
                {currentArticle.type}
              </span>
              <span className="text-sm opacity-90">
                {formatDate(new Date(currentArticle.created_datetime || Date.now()))}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2 line-clamp-2">
              {currentArticle.title}
            </h2>
            <p className="text-base opacity-90 line-clamp-2">
              {currentArticle.description}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
} 