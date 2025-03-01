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
  const [relatedNews, setRelatedNews] = useState<news[]>([]);
  const [categoryNews, setCategoryNews] = useState<news[]>([]);
  const [latestUpdates, setLatestUpdates] = useState<news[]>([]);
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

    const fetchRelatedNews = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?num=3&randomize=true`
        );
        const data = await response.json();
        if (response.ok) {
          setRelatedNews(data.filter((n: news) => n.articleId !== params.articleId));
        }
      } catch (error) {
        console.error("Failed to fetch related articles:", error);
      }
    };

    const fetchCategoryNews = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?num=4&randomize=true`
        );
        const data = await response.json();
        if (response.ok) {
          setCategoryNews(data.filter((n: news) => n.articleId !== params.articleId));
        }
      } catch (error) {
        console.error("Failed to fetch category articles:", error);
      }
    };

    const fetchLatestUpdates = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?num=6&randomize=true`
        );
        const data = await response.json();
        if (response.ok) {
          setLatestUpdates(data.filter((n: news) => n.articleId !== params.articleId));
        }
      } catch (error) {
        console.error("Failed to fetch latest updates:", error);
      }
    };

    fetchArticle();
    fetchTrendingNewsArticle();
    fetchRelatedNews();
    fetchCategoryNews();
    fetchLatestUpdates();
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
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-muted-foreground hover:text-primary"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Articles
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-muted-foreground hover:text-primary"
              >
                <Share2 className="h-4 w-4 mr-2" />
                {isCopied ? "Copied!" : "Share Article"}
              </Button>
            </div>

            <div className="space-y-8">
              {/* Article Header */}
              <header className="border-b border-border/60 pb-8">
                <div className="flex items-center gap-3 mb-4">
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
                <div className="text-lg text-muted-foreground leading-relaxed font-medium">
                  <Markdown 
                    content={article.description?.split('.')[0] + '.'} 
                    className="line-clamp-3"
                  />
                </div>
              </header>

              {/* Featured Image */}
              <figure className="relative">
                <div className="aspect-[16/9] rounded-xl overflow-hidden">
                  <img
                    src={article.lphoto}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="text-sm text-muted-foreground mt-3 text-center italic">
                  {article.title}
                </figcaption>
              </figure>

              {/* Article Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="text-lg font-medium text-muted-foreground mb-8 leading-relaxed italic border-l-4 border-primary/20 pl-6 py-2 bg-muted/30 rounded-r-lg">
                  <Markdown 
                    content={article.description?.split('.')[0] + '.'} 
                    className="line-clamp-3"
                  />
                </div>
                <div className="space-y-6">
                  <Markdown 
                    content={article.description}
                    className="prose-headings:font-serif prose-headings:font-bold prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-primary/50 prose-blockquote:bg-muted/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg"
                  />
                </div>

                {/* Additional Content Section */}
                <div className="mt-12 pt-8 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Key Takeaways */}
                    <div className="bg-muted/30 rounded-lg p-6">
                      <h3 className="font-serif text-xl font-bold mb-4">Key Takeaways</h3>
                      <ul className="space-y-3 text-base">
                        {article.description?.split('.').slice(0, 3).map((point: string, index: number) => (
                          point.trim() && (
                            <li key={index} className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span className="text-muted-foreground">{point.trim()}.</span>
                            </li>
                          )
                        ))}
                      </ul>
                    </div>

                    {/* Related Topics */}
                    <div className="bg-muted/30 rounded-lg p-6">
                      <h3 className="font-serif text-xl font-bold mb-4">Related Topics</h3>
                      <div className="flex flex-wrap gap-2">
                        {['Markets', 'Finance', 'Technology', 'Business', article.type].map((topic: string, index: number) => (
                          <Link 
                            key={index}
                            href={`/category/${topic.toLowerCase()}`}
                            className="inline-flex items-center px-3 py-1 rounded-full bg-background hover:bg-accent/50 transition-colors text-sm font-medium"
                          >
                            {topic}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Share and Engagement Section */}
                <div className="mt-12 pt-8 border-t border-border">
                  <div className="bg-card rounded-xl p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-center md:text-left">
                        <h3 className="font-serif text-2xl font-bold mb-2">Share this article</h3>
                        <p className="text-muted-foreground">Help others stay informed about {article.type}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
              onClick={handleShare}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          {isCopied ? "Copied!" : "Share Link"}
                        </Button>
                        <Link href={`/category/${article.type.toLowerCase()}`}>
                          <Button
                            variant="default"
                            className="bg-primary/90 hover:bg-primary"
                          >
                            More in {article.type}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Footer */}
              <footer className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-12">
                  <div className="flex items-center gap-4">
                    <span>Published in <Link href={`/category/${article.type.toLowerCase()}`} className="font-medium text-foreground hover:text-primary">{article.type}</Link></span>
                    <span>•</span>
                    <span>{formatDate(new Date(article.created_datetime || Date.now()))}</span>
                  </div>
                </div>

                {/* You May Also Like Section */}
                <div className="mb-16">
                  <h3 className="font-serif text-2xl font-bold mb-8">You May Also Like</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedNews.map((relatedArticle) => (
                      <Link
                        key={relatedArticle.articleId}
                        href={`/view/${relatedArticle.articleId}`}
                        className="group"
                      >
                        <Card className="overflow-hidden hover:bg-accent/5 transition-all duration-300 border-border/60">
                          <div className="aspect-[16/9] overflow-hidden">
                            <img
                              src={relatedArticle.sphoto}
                              alt={relatedArticle.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-6">
                            <Badge variant="outline" className="mb-3 font-serif">
                              {relatedArticle.type}
                            </Badge>
                            <h4 className="font-serif text-lg font-medium leading-snug mb-3 group-hover:text-primary/80 transition-colors line-clamp-2">
                              {relatedArticle.title}
                            </h4>
                            <div className="text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 inline mr-1" />
                              {formatDate(new Date(relatedArticle.created_datetime || Date.now()))}
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Popular in Category */}
                <div className="mb-16">
                  <h3 className="font-serif text-2xl font-bold mb-8">Popular in {article.type}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {categoryNews.map((categoryArticle) => (
                      <Link
                        key={categoryArticle.articleId}
                        href={`/view/${categoryArticle.articleId}`}
                        className="group"
                      >
                        <Card className="flex overflow-hidden hover:bg-accent/5 transition-all duration-300 border-border/60">
                          <div className="w-40 aspect-[4/3] flex-shrink-0 overflow-hidden">
                            <img
                              src={categoryArticle.sphoto}
                              alt={categoryArticle.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <Badge variant="outline" className="mb-3 font-serif">
                              {categoryArticle.type}
                            </Badge>
                            <h4 className="font-serif text-lg font-medium leading-snug mb-3 group-hover:text-primary/80 transition-colors line-clamp-2">
                              {categoryArticle.title}
                            </h4>
                            <div className="text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 inline mr-1" />
                              {formatDate(new Date(categoryArticle.created_datetime || Date.now()))}
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Latest Updates */}
                <div>
                  <h3 className="font-serif text-2xl font-bold mb-8">Latest Updates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {latestUpdates.map((update) => (
                      <Link
                        key={update.articleId}
                        href={`/view/${update.articleId}`}
                        className="group"
                      >
                        <Card className="p-6 hover:bg-accent/5 transition-all duration-300 border-border/60">
                          <div className="flex items-start gap-4">
                            <div className="w-20 aspect-square flex-shrink-0 overflow-hidden rounded-lg">
                              <img
                                src={update.sphoto}
                                alt={update.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Badge variant="outline" className="mb-2 font-serif text-xs">
                                {update.type}
                              </Badge>
                              <h4 className="font-serif text-base font-medium leading-snug group-hover:text-primary/80 transition-colors line-clamp-2 mb-2">
                                {update.title}
                              </h4>
                              <div className="text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {formatDate(new Date(update.created_datetime || Date.now()))}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </footer>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-8 space-y-8">
              {/* Categories All See Link */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
