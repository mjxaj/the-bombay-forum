"use client";
import "../../assets/css/Home.scss";
import React, { useEffect, useState } from "react";
import { news } from "./utilfunctions/interfaces";
import MarketTicker from "./components/MarketTicker";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, ArrowRight } from "lucide-react";
import { formatDate } from "./utilfunctions/dateFormatter";
import { Markdown } from "@/components/ui/markdown";

export default function Home() {
  const [mainNewsContainer, setMainNewsContainer] = useState<news[]>([]);
  const [trendingNews, setTrendingNews] = useState<news[]>([]);
  const [latestNews, setLatestNews] = useState<news[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMainNewsArticle = async () => {
      try {
        const articleType = localStorage.getItem("articleType");
        const response = await fetch(
          `/api/searcharticles?articleType=${
            articleType ? articleType : "random"
          }&num=9&randomize=false`
        );
        const data = await response.json();
        if (response.ok) {
          setMainNewsContainer(data);
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTrendingNewsArticle = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?num=15&randomize=false&sortBy=created_datetime&order=DESC`
        );
        const data = await response.json();
        if (response.ok) {
          setTrendingNews(data.slice(0, 10));
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      }
    };

    const fetchLatestNewsArticle = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?articleType=random&num=8&order=DESC`
        );
        const data = await response.json();
        if (response.ok) {
          setLatestNews(data);
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      }
    };

    fetchMainNewsArticle();
    fetchTrendingNewsArticle();
    fetchLatestNewsArticle();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="h-[500px] bg-muted rounded-lg mb-4" />
            <div className="h-8 bg-muted rounded w-2/3 mb-2" />
            <div className="h-4 bg-muted rounded w-1/2" />
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

  return (
    <>
      <MarketTicker data={undefined} />
      <main className="container mx-auto px-4 py-8">
        {/* Featured Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Main Featured Article */}
          <div className="lg:col-span-8">
            {mainNewsContainer[0] && (
              <Link href={`/view/${mainNewsContainer[0].articleId}`} className="group">
                <Card className="overflow-hidden border-none shadow-none hover:bg-accent/5 transition-all duration-300">
                  <div className="relative h-[500px] mb-6">
                    <img
                      src={mainNewsContainer[0].lphoto}
                      alt={mainNewsContainer[0].title}
                      className="w-full h-full object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <Badge variant="outline" className="font-serif mb-4 bg-black/20 backdrop-blur-sm border-white/20">
                        {mainNewsContainer[0].type}
                      </Badge>
                      <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-4 group-hover:text-primary/90 transition-colors">
                        {mainNewsContainer[0].title}
                      </h1>
                      {mainNewsContainer[0].description && (
                        <div className="text-lg text-white/90 leading-relaxed mb-4">
                          <Markdown 
                            content={mainNewsContainer[0].description}
                            className="line-clamp-2"
                          />
                        </div>
                      )}
                      <div className="flex items-center text-sm text-white/80">
                        <Clock className="h-4 w-4 mr-2" />
                        {formatDate(new Date(mainNewsContainer[0].created_datetime || Date.now()))}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )}

            {/* Secondary Featured Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mainNewsContainer.slice(1, 3).map((article) => (
                <Link key={article.articleId} href={`/view/${article.articleId}`} className="group">
                  <Card className="overflow-hidden border shadow-sm hover:shadow-md p-4 hover:bg-accent/5 transition-all duration-300">
                    <div className="aspect-video mb-4 overflow-hidden rounded-lg">
                      <img
                        src={article.sphoto}
                        alt={article.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-3 p-2">
                      <Badge variant="outline" className="font-serif">
                        {article.type}
                      </Badge>
                      <h2 className="text-xl font-serif font-semibold leading-snug group-hover:text-primary/80 transition-colors">
                        {article.title}
                      </h2>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        {formatDate(new Date(article.created_datetime || Date.now()))}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Trending News Sidebar */}
          <div className="lg:col-span-4">
            <Card className="p-6 bg-card border shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h2 className="font-serif text-lg font-bold">Trending Now</h2>
                </div>
                <Link href="/trending" className="text-sm text-primary hover:text-primary/80 transition-colors">
                  View All
                </Link>
              </div>
              <div className="space-y-6">
                {trendingNews.map((article, i) => (
                  <Link 
                    key={article.articleId}
                    href={`/view/${article.articleId}`}
                    className="block group"
                  >
                    <div className="flex gap-4 p-3 rounded-lg hover:bg-accent/5 transition-all duration-300">
                      <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={article.sphoto}
                          alt={article.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-medium leading-snug mb-2 group-hover:text-primary/80 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <Badge variant="outline" className="font-serif text-[10px]">
                            {article.type}
                          </Badge>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(new Date(article.created_datetime || Date.now()))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {i < trendingNews.length - 1 && (
                      <div className="my-4 border-t border-border" />
                    )}
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Latest News Grid */}
        <div className="border-t border-border pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl font-bold">Latest Coverage</h2>
            <Link href="/latest" className="group flex items-center text-sm text-primary hover:text-primary/80 transition-colors">
              View All Stories
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestNews.map((article) => (
              <Link 
                key={article.articleId}
                href={`/view/${article.articleId}`}
                className="group"
              >
                <Card className="overflow-hidden hover:bg-accent/5 transition-all duration-300 border shadow-sm hover:shadow-md">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={article.sphoto}
                      alt={article.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <Badge variant="outline" className="mb-3 font-serif">
                      {article.type}
                    </Badge>
                    <h3 className="font-serif text-lg font-medium leading-snug mb-3 group-hover:text-primary/80 transition-colors">
                      {article.title}
                    </h3>
                    {article.description && (
                      <div className="text-sm text-muted-foreground mb-4">
                        <Markdown 
                          content={article.description}
                          className="line-clamp-2"
                        />
                      </div>
                    )}
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(new Date(article.created_datetime || Date.now()))}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
