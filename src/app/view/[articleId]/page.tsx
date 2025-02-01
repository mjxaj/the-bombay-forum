"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image"; // Import Next.js Image component
import { formatDate } from "@/app/utilfunctions/dateFormatter";
import LeftAsideNews from "@/app/components/LeftAsideNews";
import Link from "next/link";
import { news } from "@/app/utilfunctions/interfaces";
import RightBsideNews from "@/app/components/RightBsideNews";
import { ChevronLeft, Share2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
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
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-start space-x-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Skeleton className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-96" />
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-3">
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-4">Trending News</h2>
                <Skeleton className="h-[600px] w-full" />
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-6">
              <Card className="p-4">
                <Skeleton className="h-[400px] w-full rounded-lg mb-6" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-3">
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-4">Latest News</h2>
                <Skeleton className="h-[600px] w-full" />
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-7xl mx-auto">
          <Card className="p-8 max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-destructive">Article not found</h2>
            <p className="text-muted-foreground mt-2">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Button className="mt-6" onClick={() => router.push('/')}>
              Return Home
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="max-w-7xl mx-auto">
        <Head>
          <title>{article?.title || "Article Page"}</title>
        </Head>

        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex-1">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Clock className="h-4 w-4 mr-2" />
              <span>{article.date ? formatDate(new Date(article.date)) : "Unknown Date"}</span>
            </div>
            <h1 className="text-2xl font-bold">{article.title}</h1>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="rounded-full"
          >
            <Share2 className="h-5 w-5" />
            <span className="sr-only">{isCopied ? "Copied!" : "Share"}</span>
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 lg:sticky lg:top-24 h-fit">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Trending News</h2>
              <LeftAsideNews trendingNews={trendingNews} />
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">
            <Card className="overflow-hidden">
              {article.lphoto && (
                <div className="relative h-[400px]">
                  <img 
                    src={article.lphoto} 
                    alt="Article Featured Image"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <Badge variant="secondary" className="mb-4">{article.type}</Badge>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: article.description,
                  }}
                />
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 lg:sticky lg:top-24 h-fit">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Latest News</h2>
              <RightBsideNews latestNews={latestNews} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
