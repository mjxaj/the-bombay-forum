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
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-8">
            {/* Trending Section */}
            <div className="flex items-center flex-1">
              <div className="bg-red-500 text-white px-3 h-8 flex items-center text-xs font-medium">
                Trending
              </div>
              <div className="overflow-hidden relative flex-1 h-8 flex items-center px-3">
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
                  </div>
            {/* Date and Social Links */}
           
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