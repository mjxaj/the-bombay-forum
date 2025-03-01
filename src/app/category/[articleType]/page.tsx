"use client";

import { useEffect, useState } from "react";
import { news } from "@/app/utilfunctions/interfaces";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, Filter, ArrowRight } from "lucide-react";
import { formatDate } from "@/app/utilfunctions/dateFormatter";
import { Markdown } from "@/components/ui/markdown";
import { TrendingNews } from "@/app/components/TrendingNews";
import { BottomCarousel } from "@/app/components/BottomCarousel";
import { NewsCarousel } from "@/app/components/NewsCarousel";
import { SmallNewsCarousel } from "@/app/components/SmallNewsCarousel";
import { FeatureNews } from "@/app/components/FeatureNews";

export default function CategoryPage({ params }: { params: { articleType: string } }) {
  const [articles, setArticles] = useState<news[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<news[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?articleType=${params.articleType}&num=12`
        );
        const data = await response.json();
        if (response.ok) {
          setArticles(data);
        }
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      }
    };

    const fetchTrendingArticles = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?articleType=${params.articleType}&num=5&sortBy=created_datetime&order=DESC`
        );
        const data = await response.json();
        if (response.ok) {
          setTrendingArticles(data);
        }
      } catch (error) {
        console.error("Failed to fetch trending articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
    fetchTrendingArticles();
  }, [params.articleType]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-12 bg-muted rounded w-1/3 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="h-[400px] bg-muted rounded-lg mb-8" />
            <div className="grid grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-48 bg-muted rounded-lg" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="h-8 bg-muted rounded w-full mb-4" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 mb-6">
                <div className="w-24 h-24 bg-muted rounded flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const categoryTitle = params.articleType.charAt(0).toUpperCase() + params.articleType.slice(1);
  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1, 7);
  const listArticles = articles.slice(7);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Main Content */}
        <div className="lg:w-2/3 lg:order-1">
          {/* Featured Article */}
          {featuredArticle && (
            <Link href={`/view/${featuredArticle.articleId}`} className="group block mb-10 md:mb-14">
              <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
                <div className="relative aspect-[3/2] md:aspect-[16/9] mb-0 rounded-none overflow-hidden">
                  <img
                    src={featuredArticle.lphoto}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <Badge variant="outline" className="mb-3 md:mb-5 bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 transition-colors">
                      Featured
                    </Badge>
                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-3 md:mb-5 leading-tight">
                      {featuredArticle.title}
                    </h2>
                    <div className="text-white/90 hidden md:block backdrop-blur-sm bg-black/20 p-4 rounded-lg">
                      <Markdown 
                        content={featuredArticle.description}
                        className="line-clamp-2"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          )}

          {/* Grid Articles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-14">
            {gridArticles.map((article) => (
              <Link
                key={article.articleId}
                href={`/view/${article.articleId}`}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 rounded-xl">
                  <div className="aspect-[3/2] overflow-hidden">
                    <img
                      src={article.sphoto}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 md:p-6 bg-gradient-to-b from-background/50 to-background">
                    <div className="flex items-center gap-3 mb-3 md:mb-4 flex-wrap">
                      <Badge variant="outline" className="font-serif bg-primary/5 hover:bg-primary/10 transition-colors">
                        {article.type}
                      </Badge>
                      <span className="text-xs md:text-sm text-muted-foreground/80">
                        <Clock className="h-3 w-3 md:h-4 md:w-4 inline mr-1" />
                        {formatDate(new Date(article.created_datetime || Date.now()))}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg md:text-xl font-semibold mb-3 md:mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {article.title}
                    </h3>
                    {article.description && (
                      <div className="text-muted-foreground/90 text-sm md:text-base">
                        <Markdown 
                          content={article.description}
                          className="line-clamp-2"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* List Articles */}
          <div className="space-y-5 md:space-y-6">
            {listArticles.map((article) => (
              <Link
                key={article.articleId}
                href={`/view/${article.articleId}`}
                className="group block"
              >
                <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-border/50 hover:border-primary/20 rounded-xl">
                  <div className="p-4 md:p-6 flex gap-5 md:gap-8">
                    <div className="w-32 md:w-48 aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={article.sphoto}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 md:mb-3 flex-wrap">
                        <Badge variant="outline" className="font-serif bg-primary/5 hover:bg-primary/10 transition-colors">
                          {article.type}
                        </Badge>
                        <span className="text-xs md:text-sm text-muted-foreground/80">
                          <Clock className="h-3 w-3 md:h-4 md:w-4 inline mr-1" />
                          {formatDate(new Date(article.created_datetime || Date.now()))}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg md:text-xl font-semibold mb-2 md:mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {article.title}
                      </h3>
                      {article.description && (
                        <div className="text-muted-foreground/90 text-sm md:text-base hidden md:block">
                          <Markdown 
                            content={article.description}
                            className="line-clamp-2"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-1/3 lg:order-2">
          <div className="lg:sticky lg:top-24 space-y-8">
            {/* Trending Articles */}
            <Card className="p-6 md:p-8 backdrop-blur-xl bg-background/95 border-border/50 rounded-2xl">
              <div className="flex items-center space-x-3 pb-4 mb-6 border-b border-border/50">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Trending in {categoryTitle}
                </h2>
              </div>
              <div className="space-y-6">
                {trendingArticles.map((article, i) => (
                  <Link
                    key={article.articleId}
                    href={`/view/${article.articleId}`}
                    className="block group"
                  >
                    <div className="flex gap-4 md:gap-5">
                      <div className="w-24 md:w-28 aspect-square rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={article.sphoto}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-base md:text-lg font-medium leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <div className="text-xs text-muted-foreground/80">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {formatDate(new Date(article.created_datetime || Date.now()))}
                        </div>
                      </div>
                    </div>
                    {i < trendingArticles.length - 1 && (
                      <div className="my-6 border-t border-border/50" />
                    )}
                  </Link>
                ))}
              </div>
            </Card>

            {/* Newsletter Signup */}
            <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-none rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-grid-white/5" />
              <div className="relative">
                <h3 className="font-serif text-xl md:text-2xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Stay Updated on {categoryTitle}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground/90 mb-6">
                  Get the latest {categoryTitle.toLowerCase()} news and analysis delivered to your inbox
                </p>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Subscribe to Updates
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        </aside>
      </main>

      {/* Additional Sections */}
      <div className="mt-16 space-y-16">
        {/* News Carousel Section */}
        <section>
          <NewsCarousel />
        </section>

        {/* Small News Carousel */}
        <section>
          <SmallNewsCarousel />
        </section>

        {/* Feature News Section */}
        <section className="border-t border-gray-100 pt-6">
          <FeatureNews />
          <section className="border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex gap-8">
              <BottomCarousel />
              <BottomCarousel />
            </div>
          </div>
        </section>
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
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="space-y-6">
                  {articles.slice(0, 5).map((item, index) => (
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
                            <Badge variant="outline" className="font-serif">
                              {item.type}
                            </Badge>
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
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="space-y-6">
                  {articles.slice(5, 10).map((item, index) => (
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
                            <Badge variant="outline" className="font-serif">
                              {item.type}
                            </Badge>
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
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="space-y-6">
                  {articles.slice(10, 15).map((item, index) => (
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
                            <Badge variant="outline" className="font-serif">
                              {item.type}
                            </Badge>
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
      </div>
    </div>
  );
}
