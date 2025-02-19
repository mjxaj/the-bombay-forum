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

export default function CategoryPage({ params }: { params: { type: string } }) {
  const [articles, setArticles] = useState<news[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<news[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?articleType=${params.type}&num=12`
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
          `/api/searcharticles?articleType=${params.type}&num=5&sortBy=created_datetime&order=DESC`
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
  }, [params.type]);

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

  const categoryTitle = params.type.charAt(0).toUpperCase() + params.type.slice(1);
  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1, 7);
  const listArticles = articles.slice(7);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Category Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between gap-4 mb-4 md:mb-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold">
              {categoryTitle}
            </h1>
            <Button variant="outline" size="sm" className="shrink-0">
              <Filter className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Filter Articles</span>
            </Button>
          </div>
          <p className="text-base md:text-lg text-muted-foreground font-serif">
            Latest news, analysis, and insights from the world of {categoryTitle.toLowerCase()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Featured Article */}
            {featuredArticle && (
              <Link href={`/view/${featuredArticle.articleId}`} className="group block mb-8 md:mb-12">
                <Card className="overflow-hidden border-none shadow-none hover:bg-accent/5 transition-all duration-300">
                  <div className="relative aspect-[3/2] md:aspect-[16/9] mb-4 md:mb-6 rounded-xl overflow-hidden">
                    <img
                      src={featuredArticle.lphoto}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                      <Badge variant="outline" className="mb-2 md:mb-4 bg-black/20 backdrop-blur-sm border-white/20 text-white">
                        Featured
                      </Badge>
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2 md:mb-4">
                        {featuredArticle.title}
                      </h2>
                      <div className="text-white/90 hidden md:block">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
              {gridArticles.map((article) => (
                <Link
                  key={article.articleId}
                  href={`/view/${article.articleId}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:bg-accent/5 transition-all duration-300">
                    <div className="aspect-[3/2] md:aspect-[4/3] overflow-hidden">
                      <img
                        src={article.sphoto}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 md:p-6">
                      <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 flex-wrap">
                        <Badge variant="outline" className="font-serif">
                          {article.type}
                        </Badge>
                        <span className="text-xs md:text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 md:h-4 md:w-4 inline mr-1" />
                          {formatDate(new Date(article.created_datetime || Date.now()))}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg md:text-xl font-semibold mb-2 md:mb-3 group-hover:text-primary/80 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      {article.description && (
                        <div className="text-muted-foreground text-sm md:text-base">
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
            <div className="space-y-4 md:space-y-8">
              {listArticles.map((article) => (
                <Link
                  key={article.articleId}
                  href={`/view/${article.articleId}`}
                  className="group block"
                >
                  <Card className="overflow-hidden hover:bg-accent/5 transition-all duration-300">
                    <div className="p-4 md:p-6 flex gap-4 md:gap-6">
                      <div className="w-24 md:w-48 aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={article.sphoto}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 flex-wrap">
                          <Badge variant="outline" className="font-serif">
                            {article.type}
                          </Badge>
                          <span className="text-xs md:text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 md:h-4 md:w-4 inline mr-1" />
                            {formatDate(new Date(article.created_datetime || Date.now()))}
                          </span>
                        </div>
                        <h3 className="font-serif text-base md:text-xl font-semibold mb-2 md:mb-3 group-hover:text-primary/80 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        {article.description && (
                          <div className="text-muted-foreground text-sm md:text-base hidden md:block">
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
          <aside className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="lg:sticky lg:top-24 space-y-6 md:space-y-8">
              {/* Trending Articles */}
              <Card className="p-4 md:p-6">
                <div className="flex items-center space-x-2 pb-4 mb-4 md:mb-6 border-b border-border">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <h2 className="font-serif text-lg md:text-xl font-bold">Trending in {categoryTitle}</h2>
                </div>
                <div className="space-y-4 md:space-y-6">
                  {trendingArticles.map((article, i) => (
                    <Link
                      key={article.articleId}
                      href={`/view/${article.articleId}`}
                      className="block group"
                    >
                      <div className="flex gap-3 md:gap-4">
                        <div className="w-20 md:w-24 aspect-square rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={article.sphoto}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-sm md:text-base font-medium leading-snug mb-2 group-hover:text-primary/80 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <div className="text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {formatDate(new Date(article.created_datetime || Date.now()))}
                          </div>
                        </div>
                      </div>
                      {i < trendingArticles.length - 1 && (
                        <div className="my-4 border-t border-border" />
                      )}
                    </Link>
                  ))}
                </div>
              </Card>

              {/* Newsletter Signup */}
              <Card className="p-4 md:p-6 bg-primary/5 border-none">
                <h3 className="font-serif text-base md:text-lg font-bold mb-2 md:mb-3">
                  Stay Updated on {categoryTitle}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-4">
                  Get the latest {categoryTitle.toLowerCase()} news and analysis delivered to your inbox
                </p>
                <Button className="w-full">
                  Subscribe to Updates
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Card>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
} 