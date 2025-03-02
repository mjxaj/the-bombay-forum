"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, Loader2, X, TrendingUp, ArrowRight } from "lucide-react";
import { news } from "../utilfunctions/interfaces";
import ExploreLayout from "../components/ExploreLayout";
import { TrendingNews } from "../components/TrendingNews";
import { SmallNewsCarousel } from "../components/SmallNewsCarousel";
import { MostView } from "../components/MostView";
import { FeatureNews } from "../components/FeatureNews";
import { CategoryNewsCarousel } from "../components/CategoryNewsCarousel";
import { LatestUpdatesCarousel } from "../components/LatestUpdatesCarousel";
import { BottomCarousel } from "../components/BottomCarousel";
import { FourGridCarousel } from "../components/FourGridCarousel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const trendingTopics = [
  "Markets",
  "Technology",
  "Business",
  "Finance",
  "Startups",
  "Economy",
];

export default function SearchPage() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<news[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [categoryNews, setCategoryNews] = useState<{ [key: string]: news[] }>({
    markets: [],
    finance: [],
    technology: [],
  });

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  useEffect(() => {
    if (!searchValue) return;
    
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/searcharticles?query=${searchValue}&num=20`
        );
        if (response.status === 404) {
          setSearchResults([]);
        } else {
          const data = await response.json();
          if (response.ok) {
            setSearchResults(data);
            // Save to recent searches
            const updatedSearches = [searchValue, ...recentSearches.filter(s => s !== searchValue)].slice(0, 5);
            setRecentSearches(updatedSearches);
            localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
          }
        }
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSearchResults, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchValue]);

  useEffect(() => {
    const fetchCategoryNews = async () => {
      try {
        const [marketsResponse, financeResponse, techResponse] = await Promise.all([
          fetch('/api/searcharticles?num=5&randomize=true&type=Markets'),
          fetch('/api/searcharticles?num=5&randomize=true&type=Finance'),
          fetch('/api/searcharticles?num=5&randomize=true&type=Technology')
        ]);

        const [marketsData, financeData, techData] = await Promise.all([
          marketsResponse.json(),
          financeResponse.json(),
          techResponse.json()
        ]);

        setCategoryNews({
          markets: marketsData,
          finance: financeData,
          technology: techData,
        });
      } catch (error) {
        console.error('Failed to fetch category news:', error);
      }
    };

    fetchCategoryNews();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Main Search Section */}
        <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 space-y-8">
          {/* Search Header */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl font-serif font-bold text-foreground">
              Search Articles
            </h1>
            <p className="text-muted-foreground">
              Discover the latest news and insights across markets, business, and technology
            </p>
          </motion.div>

          {/* Search Input */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-4 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search news, markets, photos, videos..."
                className="pl-12 pr-12 h-12 text-lg bg-background border-2 focus:border-primary/50"
              />
              {searchValue && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2"
                  onClick={() => setSearchValue("")}
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          </motion.div>

          {/* Trending Topics and Recent Searches Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Trending Topics */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="w-5 h-5" />
                  <h2 className="font-medium">Trending Topics</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic) => (
                    <Badge
                      key={topic}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => setSearchValue(topic)}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-4">
                  <h2 className="font-medium text-muted-foreground">Recent Searches</h2>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <Badge
                        key={search}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={() => setSearchValue(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right Column - Small News Carousel */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <SmallNewsCarousel />
            </motion.div>
          </div>

          {/* Search Results Section */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="animate-pulse">
                      <div className="aspect-[3/2] bg-muted" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  </Card>
                ))}
              </motion.div>
            ) : searchValue ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ExploreLayout
                  articles={searchResults}
                  zeroArticleMsg={`No Articles Found for "${searchValue}"`}
                />
              </motion.div>
            ) : (
              // Show additional components when no search is active
              <motion.div variants={containerVariants} className="space-y-16">
                {/* Feature News Section */}
                <section>
                  <FeatureNews />
                </section>

                {/* Four Grid Carousel */}
                <section>
                  <FourGridCarousel />
                </section>

                {/* Trending and Most Viewed Section */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <TrendingNews />
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <MostView />
                  </div>
                </section>

                {/* Category News Section */}
                <section className="bg-gray-50/50 py-12">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Top Categories</h2>
                    <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <CategoryNewsCarousel
                      title="Markets"
                      articles={categoryNews.markets}
                      categorySlug="markets"
                    />
                    <CategoryNewsCarousel
                      title="Finance"
                      articles={categoryNews.finance}
                      categorySlug="finance"
                    />
                    <CategoryNewsCarousel
                      title="Technology"
                      articles={categoryNews.technology}
                      categorySlug="technology"
                    />
                  </div>
                </section>

                {/* Latest Updates Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <LatestUpdatesCarousel />
                  <LatestUpdatesCarousel />
                </section>

                {/* Bottom Carousel Section */}
                <section className="flex flex-col lg:flex-row gap-4">
                  <div className="lg:w-1/2">
                    <BottomCarousel />
                  </div>
                  <div className="lg:w-1/2">
                    <BottomCarousel />
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
