"use client";
import Link from "next/link";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { news } from "@/app/utilfunctions/interfaces";
import { motion, AnimatePresence } from "framer-motion";

const navVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5
    }
  }
};

const marqueeVariants = {
  initial: { x: "100%" },
  animate: {
    x: "-100%",
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 30,
        ease: "linear",
      },
    },
  },
};

export function TopNavbar() {
  const [trendingArticles, setTrendingArticles] = useState<news[]>([]);
  const [location, setLocation] = useState({ city: "Loading...", temp: "--" });
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);

  useEffect(() => {
    // Fetch trending articles
    const fetchTrendingArticles = async () => {
      try {
        const response = await fetch('/api/searcharticles?num=5&randomize=false&sortBy=created_datetime&order=DESC');
        if (!response.ok) {
          throw new Error('Failed to fetch trending articles');
        }
        const data = await response.json();
        setTrendingArticles(data);
      } catch (error) {
        console.error("Failed to fetch trending articles:", error);
        // Set some default articles in case of error
        setTrendingArticles([]);
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
  }, []);

  return (
    <motion.div 
      className="w-full bg-white border-b text-sm"
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      {/* Top Bar with Trending and Date */}
      <motion.div 
        className="w-full bg-white border-b border-gray-100"
        variants={itemVariants}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-8">
            {/* Trending Section */}
            <motion.div 
              className="flex items-center flex-1 max-w-[60%] overflow-hidden"
              variants={itemVariants}
            >
              <motion.div 
                className="bg-red-500 text-white px-3 h-8 flex items-center text-xs font-medium whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Trending
              </motion.div>
              <div className="overflow-hidden relative h-8 flex items-center px-3">
                <motion.div 
                  className="whitespace-nowrap flex items-center"
                  variants={marqueeVariants}
                  initial="initial"
                  animate="animate"
                >
                  {trendingArticles.length > 0 ? (
                    [...trendingArticles, ...trendingArticles].map((article, index) => (
                      <Link 
                        key={`${article.articleId}-${index}`}
                        href={`/view/${article.articleId}`}
                        className="text-gray-600 mx-6 hover:text-primary transition-colors inline-block"
                      >
                        {article.title}
                      </Link>
                    ))
                  ) : (
                    <span className="text-gray-400">Loading trending news...</span>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Date and Social Links */}
            <motion.div 
              className="flex items-center gap-4"
              variants={itemVariants}
            >
              <motion.div 
                className="text-gray-500 whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Clock className="h-3.5 w-3.5 inline-block mr-1" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 border-l border-gray-100 pl-3"
                variants={itemVariants}
              >
                {/* Social Links */}
                {['facebook', 'twitter', 'youtube', 'instagram'].map((social) => (
                  <motion.div
                    key={social}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link href={`https://${social}.com`} className="text-gray-400 hover:text-primary">
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                        {/* ... existing social icons ... */}
                      </svg>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div 
                className="border-l border-gray-100 pl-3"
                variants={itemVariants}
              >
                <motion.select 
                  className="text-gray-500 bg-transparent border-none focus:ring-0 py-0 pl-0 pr-6 h-8"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="mr">मराठी</option>
                </motion.select>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Logo and Main Navigation */}
      <motion.div 
        className="container mx-auto px-4"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center">
              <div className="flex items-center">
                <motion.svg 
                  className="h-7 w-7 text-gray-800"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                </motion.svg>
                <motion.span 
                  className="ml-2 text-xl font-bold text-gray-800"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  The Bombay Forum
                </motion.span>
              </div>
            </Link>
          </motion.div>

          {/* Weather Widget */}
          <motion.div 
            className="flex items-center gap-1.5 text-gray-500"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.svg 
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </motion.svg>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.temp}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <span className="font-medium">{location.temp}°C</span>
                <span className="ml-1 text-gray-400">{location.city}</span>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
} 