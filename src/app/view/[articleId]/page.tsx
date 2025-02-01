"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatDate } from "@/app/utilfunctions/dateFormatter";
import Link from "next/link";
import { news } from "@/app/utilfunctions/interfaces";
import { ChevronLeft, Share2, Clock, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Markdown } from "@/components/ui/markdown";

function getRandomElement(array: news[]) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export default function ArticlePage({ params }: { params: { articleId: string } }) {
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trendingNews, setTrendingNews] = useState<news[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/searcharticles?articleId=${params.articleId}&fullDescription=true`);
        const data = await response.json();
        if (response.ok && data.length > 0) {
          setArticle(data[0]);
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
          `/api/searcharticles?num=6&randomize=false&sortBy=created_datetime&order=DESC`
        );
        const data = await response.json();
        if (response.ok) {
          setTrendingNews(data.filter((n: news) => n.articleId !== params.articleId));
        }
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      }
    };

    fetchArticle();
    fetchTrendingNewsArticle();
  }, [params.articleId]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 bg-muted rounded w-1/3 mb-4" />
          <div className="h-12 bg-muted rounded w-2/3 mb-8" />
          <div className="h-[400px] bg-muted rounded-lg mb-8" />
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
            <div className="h-4 bg-muted rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Content */}
          <article className="lg:col-span-8">
            <Button
              variant="ghost"
              size="sm"
              className="mb-6"
              onClick={() => router.back()}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            <div className="space-y-8">
              {/* Article Header */}
              <header className="border-b border-border pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="font-serif">
                    {article.type}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {formatDate(new Date(article.created_datetime || Date.now()))}
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight mb-6">
                  {article.title}
                </h1>
                <div className="flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    {isCopied ? "Copied!" : "Share"}
                  </Button>
                </div>
              </header>

              {/* Featured Image */}
              <figure className="relative">
                <img
                  src={article.lphoto}
                  alt={article.title}
                  className="w-full rounded-lg"
                />
                <figcaption className="text-sm text-muted-foreground mt-2 italic text-center">
                  {article.title}
                </figcaption>
              </figure>

              {/* Article Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="text-lg font-medium text-muted-foreground mb-8 leading-relaxed italic border-l-4 border-primary/20 pl-4">
                  <Markdown 
                    content={article.description?.split('.')[0] + '.'} 
                    className="line-clamp-3"
                  />
                </div>
                <div className="space-y-6">
                  <Markdown 
                    content={article.description}
                    className="prose-headings:font-serif prose-headings:font-bold prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-primary/50 prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-4"
                  />
                </div>
              </div>

              {/* Article Footer */}
              <footer className="border-t border-border pt-6 mt-8">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>
                    Published in <span className="font-medium text-foreground">{article.type}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    {isCopied ? "Copied!" : "Share"}
                  </Button>
                </div>
              </footer>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-8 space-y-8">
              {/* Article Info Card */}
              <Card className="p-6 bg-card border shadow-sm">
                <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-border">
                  <h2 className="font-serif text-xl font-bold">Article Info</h2>
                </div>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">Category</dt>
                    <dd className="font-medium">{article.type}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Published</dt>
                    <dd className="font-medium">
                      {formatDate(new Date(article.created_datetime || Date.now()))}
                    </dd>
                  </div>
                </dl>
              </Card>

              {/* More Articles Card */}
              <Card className="p-6 bg-card border shadow-sm">
                <div className="flex items-center space-x-2 pb-4 mb-6 border-b border-border">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <h2 className="font-serif text-xl font-bold">More Articles</h2>
                </div>
                <div className="space-y-6">
                  {trendingNews.map((article, i) => (
                    <Link
                      key={article.articleId}
                      href={`/view/${article.articleId}`}
                      className="block group"
                    >
                      <div className="space-y-3">
                        <div className="aspect-[16/9] overflow-hidden rounded-lg">
                          <img
                            src={article.sphoto}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-2 font-serif">
                            {article.type}
                          </Badge>
                          <h3 className="font-serif font-medium leading-snug mb-2 group-hover:text-primary/80 transition-colors">
                            {article.title}
                          </h3>
                          <div className="text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {formatDate(new Date(article.created_datetime || Date.now()))}
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
          </aside>
        </div>
      </main>
    </div>
  );
}
