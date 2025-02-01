"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image"; // Import Next.js Image component
import "../../../../assets/css/SpecificArticleDesign1.scss";
import { formatDate } from "@/app/utilfunctions/dateFormatter";
import LeftAsideNews from "@/app/components/LeftAsideNews";
import Link from "next/link";
import { news } from "@/app/utilfunctions/interfaces";
import RightBsideNews from "@/app/components/RightBsideNews";
import ShareWhite from "../../../../assets/img/shareWhite.png"; // Adjust your image import path
import { ChevronLeft, Share2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function getRandomElement(array: news[]) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const ArticlePage = ({ params }: { params: { articleId: string } }) => {
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trendingNews, setTrendingNews] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [marketTickerData, setMarketTickerData] = useState(<></>);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchTrendingNewsArticle = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?num=15&randomize=false&sortBy=created_datetime&order=DESC`
        );
        let data = await response.json();
        if (response.ok) {
          const randomElement = getRandomElement(data.slice(1) || data);
          setMarketTickerData(
            <Link href={`/view/${randomElement.articleId}`}>
              Breaking News: {randomElement.title}
            </Link>
          );
          data = data.slice(0, 10);
          setTrendingNews(data);
          if (data.type) {
            localStorage.setItem("articleType", data.type);
          }
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
          if (data.type) {
            localStorage.setItem("articleType", data.type);
          }
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      }
    };

    fetchTrendingNewsArticle();
    fetchLatestNewsArticle();
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?articleId=${encodeURIComponent(
            params.articleId
          )}&fullDescription=true`
        );
        const data = await response.json();
        if (response.ok) {
          setArticle(data[0]);
          if (data.type) {
            localStorage.setItem("articleType", data.type);
          }
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.articleId]);

  const handleShare = async () => {
    const articleUrl = `${window.location.origin}/view/${params.articleId}`;
    const articleTitle = article?.title || "Check out this article!";

    if (navigator.share) {
      try {
        await navigator.share({
          title: articleTitle,
          text: article.description,
          url: articleUrl,
        });
        console.log("Article shared successfully!");
      } catch (error) {
        console.error("Error sharing article:", error);
      }
    } else {
      navigator.clipboard.writeText(articleUrl).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  if (loading) {
    return (
      <div className="specific-article-design1">
        <div className="header">
          <div className="go-back">
            <Skeleton className="h-5 w-5" />
          </div>
          <div className="date-title">
            <div className="date">
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="title">
              <Skeleton className="h-8 w-96" />
            </div>
          </div>
        </div>

        <div className="body">
          <div className="leftaside">
            <div className="heading">Trending News</div>
            <div className="body">
              <Skeleton className="h-[600px] w-full" />
            </div>
          </div>

          <div className="article-dis">
            <div className="image">
              <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>
            <div className="space-y-4 mt-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          <div className="right-aside">
            <div className="heading">Latest News</div>
            <div className="body">
              <Skeleton className="h-[600px] w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="specific-article-design1">
        <div className="body">
          <div className="article-dis">
            <div className="text-center p-6">
              <h2 className="text-2xl font-bold text-destructive">Article not found</h2>
              <p className="text-muted-foreground mt-2">The article you're looking for doesn't exist or has been removed.</p>
              <Button className="mt-4" onClick={() => router.push('/')}>
                Return Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="specific-article-design1">
      <Head>
        <title>{article?.title || "Article Page"}</title>
      </Head>

      <div className="header">
        <div className="go-back" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </div>
        <div className="date-title">
          <div className="date">
            {article.date ? formatDate(new Date(article.date)) : "Unknown Date"}
          </div>
          <div className="title">{article.title}</div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleShare}
          className="ml-auto"
        >
          <Share2 className="h-4 w-4" />
          <span className="sr-only">{isCopied ? "Copied!" : "Share"}</span>
        </Button>
      </div>

      <div className="body">
        <div className="leftaside">
          <div className="heading">Trending News</div>
          <div className="body">
            <LeftAsideNews trendingNews={trendingNews} />
          </div>
        </div>

        <div className="article-dis">
          <div className="image">
            <img 
              src={article.lphoto} 
              alt="Article Featured Image"
            />
          </div>
          <div
            className="des"
            dangerouslySetInnerHTML={{
              __html: article.description,
            }}
          />
        </div>

        <div className="right-aside">
          <div className="heading">Latest News</div>
          <div className="body">
            <RightBsideNews latestNews={latestNews} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
