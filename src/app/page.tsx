"use client";
import "../../assets/css/Home.scss";
import LeftAsideNews from "./components/LeftAsideNews";
import RightBsideNews from "./components/RightBsideNews";
import React, { useEffect, useState } from "react";
import NewsBlock, { SkeletonNewsBlock } from "./components/NewsBlock";
import MarketTicker from "./components/MarketTicker";
import Link from "next/link";
import { news } from "./utilfunctions/interfaces";
import ExploreLayout from "./components/ExploreLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [mainNewsContainer, setMainNewsContainer] = useState<news[]>([]);
  const [trendingNews, setTrendingNews] = useState<news[]>([]);
  const [latestNews, setLatestNews] = useState<news[]>([]);
  const [loading, setLoading] = useState(true);
  const [marketTickerData, setMarketTickerData] = useState("");
  const [searchValue, setSearchValue] = useState("");

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

  const HomeLayout = () => {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border-b border-border py-2">
            <MarketTicker data={marketTickerData} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 mt-4">
            <div className="md:col-span-3 md:sticky md:top-20 h-fit">
              <Card className="overflow-hidden border shadow-sm">
                <div className="bg-primary/10 p-3">
                  <h2 className="text-lg font-semibold">Trending News</h2>
                </div>
                <LeftAsideNews trendingNews={trendingNews} />
              </Card>
            </div>

            <div className="md:col-span-6 space-y-4">
              {loading ? (
                <Card className="w-full animate-pulse overflow-hidden shadow-sm">
                  <div className="h-[400px] bg-muted" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-8 bg-muted rounded w-3/4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded w-5/6" />
                    </div>
                  </div>
                </Card>
              ) : (
                <>
                  <Card className="overflow-hidden shadow-sm">
                    {mainNewsContainer[0]?.lphoto && (
                      <div className="relative h-[400px]">
                        <img
                          src={mainNewsContainer[0]?.lphoto}
                          alt={mainNewsContainer[0]?.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <Badge variant="secondary" className="mb-3">Featured</Badge>
                          <h1 className="text-2xl sm:text-3xl font-bold mb-4 line-clamp-2">
                            {mainNewsContainer[0]?.title}
                          </h1>
                          <div 
                            className="prose prose-sm prose-invert mb-4 line-clamp-3"
                            dangerouslySetInnerHTML={{
                              __html: mainNewsContainer[0]?.description,
                            }}
                          />
                          <Button 
                            variant="secondary"
                            className="hover:bg-white hover:text-primary"
                            asChild
                          >
                            <Link href={`/view/${mainNewsContainer[0]?.articleId || ""}`}>
                              Read More
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>

                  <div className="space-y-4">
                    {loading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonNewsBlock key={i} />
                      ))
                    ) : (
                      mainNewsContainer.slice(1).map((news, i) => (
                        <NewsBlock key={i} news={news} />
                      ))
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="md:col-span-3 md:sticky md:top-20 h-fit">
              <Card className="overflow-hidden border shadow-sm">
                <div className="bg-primary/10 p-3">
                  <h2 className="text-lg font-semibold">Latest News</h2>
                </div>
                <RightBsideNews latestNews={latestNews} />
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-background">
      {searchValue ? (
        <div className="pt-16">
          <ExploreLayout
            articles={[]}
            zeroArticleMsg={`No Articles Found for "${searchValue}"`}
          />
        </div>
      ) : (
        <HomeLayout />
      )}
    </main>
  );
}
