"use client";

import React, { useEffect, useState } from "react";
import { news } from "./utilfunctions/interfaces";
import MarketTicker from "./components/MarketTicker";
import { NewsCarousel } from "./components/NewsCarousel";
import { SmallNewsCarousel } from "./components/SmallNewsCarousel";
import { FeatureNews } from "./components/FeatureNews";
import { TrendingNews } from "./components/TrendingNews";
import { SocialStats } from "./components/SocialStats";
import { BottomCarousel } from "./components/BottomCarousel";
import { EntertainmentNews } from "./components/EntertainmentNews";
import { SportsNews } from "./components/SportsNews";
import Link from "next/link";
import { formatDate } from "./utilfunctions/dateFormatter";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [marketsNews, setMarketsNews] = useState<news[]>([]);
  const [financeNews, setFinanceNews] = useState<news[]>([]);
  const [techNews, setTechNews] = useState<news[]>([]);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
        setLoading(false);
    }, 1000);

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

        setMarketsNews(marketsData);
        setFinanceNews(financeData);
        setTechNews(techData);
      } catch (error) {
        console.error('Failed to fetch category news:', error);
      }
    };

    fetchCategoryNews();
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="animate-pulse">
          {/* Market Ticker Skeleton */}
          <div className="h-10 bg-gray-100" />

          {/* News Carousel Skeleton */}
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
                <div className="aspect-video bg-gray-200 rounded-lg" />
              </div>
              <div className="lg:col-span-4">
                <div className="bg-gray-100 rounded-lg h-[400px]" />
              </div>
            </div>
          </div>

          {/* Small News Carousel Skeleton */}
          <div className="container mx-auto px-4 py-4">
            <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex-none w-[400px]">
                  <div className="flex gap-3 bg-gray-100 rounded-lg p-3 h-[104px]" />
                </div>
              ))}
            </div>
          </div>

          {/* Feature News Skeleton */}
          <div className="container mx-auto px-4 py-8">
            <div className="h-8 bg-gray-200 w-48 rounded mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[4/3] bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Trending News and Social Stats Skeleton */}
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <div className="h-8 bg-gray-200 w-48 rounded mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-[200px] aspect-[4/3] bg-gray-200 rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 w-1/4 rounded" />
                        <div className="h-6 bg-gray-200 w-3/4 rounded" />
                        <div className="h-4 bg-gray-200 w-full rounded" />
                      </div>
                    </div>
                  ))}
                </div>
                  </div>
              <div className="lg:col-span-4">
                <div className="h-8 bg-gray-200 w-48 rounded mb-6" />
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Carousel Skeleton */}
          <div className="mt-8">
            <div className="aspect-[21/9] bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Market Ticker */}
      <div className="border-b border-gray-200">
      <MarketTicker data={undefined} />
                        </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* News Carousel Section */}
        <section className="pt-4">
          <NewsCarousel />
        </section>

        {/* Small News Carousel */}
        <section>
          <SmallNewsCarousel />
        </section>

        {/* Feature News Section */}
        <section className="border-t border-gray-100 pt-6">
          <FeatureNews />
        </section>

        {/* Trending News and Social Stats Section */}
        <section className="border-t border-gray-100 pt-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1">
              <div className="w-full">
                <TrendingNews />
                      </div>
                    </div>
                  </div>
        </section>

        {/* Bottom Carousels Section */}
        <section className="border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex gap-8">
              <BottomCarousel />
              <BottomCarousel />
            </div>
          </div>
        </section>

        {/* Category News Sections */}
        <section className="border-t border-gray-100 pt-12 pb-16 bg-gray-50/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Top Categories</h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Markets News */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-serif font-bold text-gray-900">Markets</h2>
                  <Link 
                    href="/category/markets" 
                    className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
                  >
                    View All
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
              </Link>
                </div>
                <div className="space-y-6">
                  {marketsNews.map((item, index) => (
                    <Link href={`/view/${item.articleId}`} key={item.articleId} className="group">
                      {index === 0 ? (
                        // First item with larger image
                        <div className="mb-6">
                          <div className="aspect-[16/9] rounded-lg overflow-hidden mb-4">
                            <img
                              src={item.lphoto}
                              alt={item.title}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-500 text-xs font-medium rounded-full">
                              {item.type}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(new Date(item.created_datetime || Date.now()))}
                            </span>
                          </div>
                          <h3 className="text-lg font-medium line-clamp-2 group-hover:text-blue-500 transition-colors">
                            {item.title}
                          </h3>
                        </div>
                      ) : (
                        // Other items in list format
                        <div className="flex gap-4 group-hover:bg-gray-50/80 p-3 rounded-lg transition-colors">
                          <div className="w-24 h-20 flex-shrink-0 overflow-hidden rounded-lg">
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
                      )}
                </Link>
              ))}
            </div>
          </div>

              {/* Finance News */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-serif font-bold text-gray-900">Finance</h2>
                  <Link 
                    href="/category/finance" 
                    className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
                  >
                    View All
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="space-y-6">
                  {financeNews.map((item, index) => (
                    <Link href={`/view/${item.articleId}`} key={item.articleId} className="group">
                      {index === 0 ? (
                        // First item with larger image
                        <div className="mb-6">
                          <div className="aspect-[16/9] rounded-lg overflow-hidden mb-4">
                            <img
                              src={item.lphoto}
                              alt={item.title}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-500 text-xs font-medium rounded-full">
                              {item.type}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(new Date(item.created_datetime || Date.now()))}
                            </span>
                          </div>
                          <h3 className="text-lg font-medium line-clamp-2 group-hover:text-blue-500 transition-colors">
                            {item.title}
                          </h3>
                        </div>
                      ) : (
                        // Other items in list format
                        <div className="flex gap-4 group-hover:bg-gray-50/80 p-3 rounded-lg transition-colors">
                          <div className="w-24 h-20 flex-shrink-0 overflow-hidden rounded-lg">
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
                      )}
                </Link>
                  ))}
                </div>
              </div>

              {/* Technology News */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-serif font-bold text-gray-900">Technology</h2>
                  <Link 
                    href="/category/technology" 
                    className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
                  >
                    View All
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="space-y-6">
                  {techNews.map((item, index) => (
                    <Link href={`/view/${item.articleId}`} key={item.articleId} className="group">
                      {index === 0 ? (
                        // First item with larger image
                        <div className="mb-6">
                          <div className="aspect-[16/9] rounded-lg overflow-hidden mb-4">
                            <img
                              src={item.lphoto}
                              alt={item.title}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-500 text-xs font-medium rounded-full">
                              {item.type}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(new Date(item.created_datetime || Date.now()))}
                            </span>
                          </div>
                          <h3 className="text-lg font-medium line-clamp-2 group-hover:text-blue-500 transition-colors">
                            {item.title}
                          </h3>
                        </div>
                      ) : (
                        // Other items in list format
                        <div className="flex gap-4 group-hover:bg-gray-50/80 p-3 rounded-lg transition-colors">
                          <div className="w-24 h-20 flex-shrink-0 overflow-hidden rounded-lg">
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
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Showcase */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Categories Grid */}
              <div className="lg:col-span-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Restaurant Category */}
                  <Link href="/category/restaurant" className="group relative block aspect-[16/9] overflow-hidden rounded-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60" 
                      alt="Restaurant"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/50 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Restaurant</h3>
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Entertainment Category */}
                  <Link href="/category/entertainment" className="group relative block aspect-[16/9] overflow-hidden rounded-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1603739903239-8b6e64c3b185?w=800&auto=format&fit=crop&q=60" 
                      alt="Entertainment"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/50 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Entertainment</h3>
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Financial Category */}
                  <Link href="/category/financial" className="group relative block aspect-[16/9] overflow-hidden rounded-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60" 
                      alt="Financial"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/50 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Financial</h3>
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
              </div>
          </div>
        </div>
                  </Link>

                  {/* Business Category */}
                  <Link href="/category/business" className="group relative block aspect-[16/9] overflow-hidden rounded-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60" 
                      alt="Business"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/50 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Business</h3>
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
            </Link>

                  {/* Scientists Category */}
                  <Link href="/category/scientists" className="group relative block aspect-[16/9] overflow-hidden rounded-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&auto=format&fit=crop&q=60" 
                      alt="Scientists"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/50 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Scientists</h3>
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
          </div>
                  </Link>

                  {/* International Category */}
                  <Link href="/category/international" className="group relative block aspect-[16/9] overflow-hidden rounded-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1526470498-9ae73c665de8?w=800&auto=format&fit=crop&q=60" 
                      alt="International"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/50 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">International</h3>
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-4">
                {/* Categories All See Link */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Categories</h3>
                    <Link 
                      href="/categories" 
                      className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      ALL SEE
                    </Link>
                  </div>
                </div>

                {/* News App Promotion */}
                <div className="bg-[#1d1d1d] rounded-xl p-8 text-white">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Newspark</h2>
                    <p className="text-white/80 text-sm mb-6">Newspark responsive newspaper and magazine WordPress theme</p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">810x10px Area</h3>
                          <p className="text-sm text-white/60">Advertisement</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">350x250px Area</h3>
                          <p className="text-sm text-white/60">Advertisement</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                      PURCHASE NOW
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
          </div>
        </div>
  );
}
