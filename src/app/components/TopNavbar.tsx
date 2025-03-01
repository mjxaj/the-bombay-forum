"use client";
import Link from "next/link";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { news } from "@/app/utilfunctions/interfaces";

export function TopNavbar() {
  const [trendingArticles, setTrendingArticles] = useState<news[]>([]);
  const [location, setLocation] = useState({ city: "Loading...", temp: "--" });
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);

  useEffect(() => {
    // Fetch trending articles
    const fetchTrendingArticles = async () => {
      try {
        const response = await fetch('/api/searcharticles?num=5&sortBy=created_datetime&order=DESC');
        const data = await response.json();
        if (response.ok) {
          setTrendingArticles(data);
        }
      } catch (error) {
        console.error("Failed to fetch trending articles:", error);
      }
    };

    // Fetch location and weather data
    const fetchWeatherData = async () => {
      try {
        const geoResponse = await fetch('https://ipapi.co/json/');
        const geoData = await geoResponse.json();
        
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${geoData.city}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`);
        const weatherData = await weatherResponse.json();
        
        setLocation({
          city: geoData.city,
          temp: Math.round(weatherData.main.temp).toString()
        });
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
        setLocation({ city: "Mumbai", temp: "30" }); // Fallback to default
      }
    };

    fetchTrendingArticles();
    fetchWeatherData();

    // Rotate through trending articles
    const interval = setInterval(() => {
      setCurrentArticleIndex(prev => 
        prev === trendingArticles.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [trendingArticles.length]);

  return (
    <div className="w-full bg-white border-b text-sm">
      {/* Top Bar with Trending and Date */}
      <div className="w-full bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-8">
            {/* Trending Section */}
            <div className="flex items-center flex-1 max-w-[60%]">
              <div className="bg-red-500 text-white px-3 h-8 flex items-center text-xs font-medium whitespace-nowrap">
                Trending
              </div>
              <div className="overflow-hidden relative h-8 flex items-center px-3">
                <div className="animate-marquee whitespace-nowrap">
                  {trendingArticles.map((article, index) => (
                    <Link 
                      key={article.articleId} 
                      href={`/view/${article.articleId}`}
                      className="text-gray-600 mx-4 hover:text-primary transition-colors inline-block"
                    >
                      {article.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Date and Social Links */}
            <div className="flex items-center gap-4">
              <div className="text-gray-500 whitespace-nowrap">
                <Clock className="h-3.5 w-3.5 inline-block mr-1" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center gap-3 border-l border-gray-100 pl-3">
                <Link href="https://facebook.com" className="text-gray-400 hover:text-primary">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                  </svg>
                </Link>
                <Link href="https://twitter.com" className="text-gray-400 hover:text-primary">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                  </svg>
                </Link>
                <Link href="https://youtube.com" className="text-gray-400 hover:text-primary">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </Link>
                <Link href="https://instagram.com" className="text-gray-400 hover:text-primary">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </Link>
              </div>
              <div className="border-l border-gray-100 pl-3">
                <select className="text-gray-500 bg-transparent border-none focus:ring-0 py-0 pl-0 pr-6 h-8">
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="mr">मराठी</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo and Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <svg className="h-7 w-7 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-800">The Bombay Forum</span>
            </div>
          </Link>

          {/* Weather Widget */}
          <div className="flex items-center gap-1.5 text-gray-500">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <div>
              <span className="font-medium">{location.temp}°C</span>
              <span className="ml-1 text-gray-400">{location.city}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 