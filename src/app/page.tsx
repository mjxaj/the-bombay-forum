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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [mainNewsContainer, setMainNewsContainer] = useState<news[]>([]);
  const [latestNews, setLatestNews] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [marketTickerData, setMarketTickerData] = useState(<></>);
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

  const HomeLayout = () => {
    return (
      <div className="container">
        <aside className="left-aside">
          <div className="new-list-block">
            <div className="heading">Trending News</div>
            <div className="body">
              <LeftAsideNews trendingNews={trendingNews} />
            </div>
          </div>
        </aside>

        <div className="home-main">
          {loading ? (
            <div className="skeleton-card">
              <div className="skeleton-card__image"></div>
              <div className="skeleton-card__content">
                <div className="skeleton-card__title">
                  <div className="loading-line"></div>
                </div>
                <div className="skeleton-card__description">
                  <div className="loading-line"></div>
                  <div className="loading-line"></div>
                  <div className="loading-line"></div>
                </div>
                <div className="skeleton-card__see-more">
                  <div className="loading-line"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="content-card">
              <img
                src={mainNewsContainer[0]?.lphoto}
                alt={mainNewsContainer[0]?.title}
                className="content-card__image"
              />
              <div className="content-card__content">
                <Badge variant="secondary" className="mb-2">Featured</Badge>
                <h3 className="content-card__title">{mainNewsContainer[0]?.title}</h3>
                <div 
                  className="content-card__description"
                  dangerouslySetInnerHTML={{
                    __html: mainNewsContainer[0]?.description,
                  }}
                />
                <Button 
                  variant="outline" 
                  className="mt-4"
                  asChild
                >
                  <Link href={`/view/${mainNewsContainer[0]?.articleId || ""}`}>
                    Read More
                  </Link>
                </Button>
              </div>
            </div>
          )}

          <div className="more-main-news">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonNewsBlock key={i} />
                ))
              : mainNewsContainer.slice(1).map((news, i) => (
                  <React.Fragment key={i}>
                    <hr />
                    <NewsBlock news={news} />
                  </React.Fragment>
                ))}
          </div>
        </div>

        <aside className="right-aside">
          <div className="new-list-block">
            <div className="heading">Latest News</div>
            <div className="body">
              <RightBsideNews latestNews={latestNews} />
            </div>
          </div>
        </aside>
      </div>
    );
  };

  return (
    <main>
      <MarketTicker data={marketTickerData} />
      {searchValue ? (
        <ExploreLayout
          articles={searchOptions}
          zeroArticleMsg={`No Articles Found for "${searchValue}"`}
        />
      ) : (
        <HomeLayout />
      )}
    </main>
  );
}
