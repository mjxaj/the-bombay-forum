"use client";
import "../../assets/css/Home.scss";
import React, { useEffect, useState } from "react";
import { news } from "./utilfunctions/interfaces";
import MarketTicker from "./components/MarketTicker";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp } from "lucide-react";
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
            <div className="h-[400px] bg-muted rounded-lg mb-4" />
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Main Featured Article */}
          <div className="lg:col-span-8">
            {mainNewsContainer[0] && (
              <Link href={`/view/${mainNewsContainer[0].articleId}`} className="group">
                <Card className="overflow-hidden border-none shadow-none p-4 hover:bg-accent/5 transition-colors">
                  <div className="relative h-[400px] mb-4">
                    <img
                      src={mainNewsContainer[0].lphoto}
                      alt={mainNewsContainer[0].title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-3 px-1">
                    <Badge variant="outline" className="font-serif">
                      {mainNewsContainer[0].type}
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight group-hover:text-primary/80 transition-colors">
                      {mainNewsContainer[0].title}
                    </h1>
                    {mainNewsContainer[0].description && (
                      <div className="text-lg text-muted-foreground leading-relaxed">
                        <Markdown 
                          content={mainNewsContainer[0].description}
                          className="line-clamp-3"
                        />
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {formatDate(new Date(mainNewsContainer[0].created_datetime || Date.now()))}
                    </div>
                  </div>
                </Card>
              </Link>
            )}

            {/* Secondary Featured Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {mainNewsContainer.slice(1, 3).map((article) => (
                <Link key={article.articleId} href={`/view/${article.articleId}`} className="group">
                  <Card className="overflow-hidden border shadow-sm p-4 hover:bg-accent/5 transition-colors">
                    <div className="aspect-[4/3] mb-4">
                      <img
                        src={article.sphoto}
                        alt={article.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="space-y-3 px-1">
                      <Badge variant="outline" className="font-serif">
                        {article.type}
                      </Badge>
                      <h2 className="text-xl font-serif font-semibold leading-snug group-hover:text-primary/80 transition-colors">
                        {article.title}
                      </h2>
                      <div className="text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 inline mr-1" />
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
              <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-border">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h2 className="font-serif text-lg font-bold">Trending Now</h2>
              </div>
              <div className="space-y-4">
                {trendingNews.map((article, i) => (
                  <Link 
                    key={article.articleId}
                    href={`/view/${article.articleId}`}
                    className="block group"
                  >
                    <div className="flex gap-4 p-3 rounded-lg hover:bg-accent/5 transition-colors">
                      <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={article.sphoto}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-serif text-sm font-medium leading-snug mb-2 group-hover:text-primary/80 transition-colors">
                          {article.title}
                        </h3>
                        <div className="text-xs text-muted-foreground">
                          <Badge variant="outline" className="mr-2 font-serif text-[10px]">
                            {article.type}
                          </Badge>
                          <span className="inline-flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(new Date(article.created_datetime || Date.now()))}
                          </span>
                        </div>
                      </div>
                    </div>
                    {i < trendingNews.length - 1 && (
                      <div className="my-3 border-t border-border" />
                    )}
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Latest News Grid */}
        <div className="border-t border-border pt-8 mt-12">
          <h2 className="font-serif text-2xl font-bold mb-8">Latest Coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestNews.map((article) => (
              <Link 
                key={article.articleId}
                href={`/view/${article.articleId}`}
                className="group"
              >
                <Card className="p-4 hover:bg-accent/5 transition-colors border shadow-sm">
                  <div className="space-y-4">
                    <div className="aspect-[4/3] overflow-hidden rounded-lg">
                      <img
                        src={article.sphoto}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="px-1">
                      <Badge variant="outline" className="mb-3 font-serif">
                        {article.type}
                      </Badge>
                      <h3 className="font-serif text-lg font-medium leading-snug mb-3 group-hover:text-primary/80 transition-colors">
                        {article.title}
                      </h3>
                      {article.description && (
                        <div className="text-sm text-muted-foreground mb-3">
                          <Markdown 
                            content={article.description}
                            className="line-clamp-2"
                          />
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {formatDate(new Date(article.created_datetime || Date.now()))}
                      </div>
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
