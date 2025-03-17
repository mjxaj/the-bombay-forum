"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatDate } from "@/app/utilfunctions/dateFormatter";
import Link from "next/link";
import { news } from "@/app/utilfunctions/interfaces";
import { ChevronLeft, Share2, Clock, TrendingUp, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Markdown } from "@/components/ui/markdown";
import { motion } from "framer-motion";

function getRandomElement(array: news[]) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// Add these animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

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
      <main className="container mx-auto px-4 py-8 md:py-12">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={staggerChildren}
        >
          <motion.article 
            className="lg:col-span-8"
            variants={fadeInUp}
          >
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
              <motion.header 
                className="border-b border-border/60 pb-8 mb-8"
                variants={fadeInUp}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="font-serif">
                    {article.type}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {formatDate(new Date(article.created_datetime || Date.now()))}
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-4">
                  {article.title}
                </h1>
                
                {/* Author and Share Section */}
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                        <img
                          src={article.author?.photo || '/placeholder-author.jpg'}
                          alt={article.author?.name || 'Author'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{article.author?.name || 'Rafiqul Islam'}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(new Date(article.created_datetime || Date.now()))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => window.open('https://facebook.com/share', '_blank')}>
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                      </svg>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => window.open('https://twitter.com/share', '_blank')}>
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                      </svg>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.header>

              {/* Lead Text */}
              <div className="text-lg text-muted-foreground leading-relaxed my-6">
                {article.description?.split('.')[0] + '.'}
              </div>

              {/* First Part of Content */}
              <div className="space-y-6 mb-8">
                {article.description?.split('\n').slice(1, 3).map((paragraph: string, index: number) => (
                  <p key={index} className="text-base leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Featured Image */}
              <motion.figure 
                className="my-8"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={article.lphoto}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="text-sm text-muted-foreground mt-2 text-center">
                  {article.title}
                </figcaption>
              </motion.figure>

              {/* Main Content */}
              <motion.div 
                className="space-y-6"
                variants={fadeInUp}
              >
                {/* Quote Section - Only if quote exists in content */}
                {article.description?.includes('"') && (
                  <div className="my-8">
                    <blockquote className="text-lg italic text-muted-foreground border-l-4 border-primary/50 pl-4 py-1">
                      {article.description?.match(/"([^"]*)"/)?.[0]}
                    </blockquote>
                </div>
                )}

                {/* Rest of the Content */}
                <div className="space-y-6">
                  {article.description?.split('\n').map((paragraph: string, index: number) => {
                    // Skip empty paragraphs
                    if (!paragraph.trim()) return null;

                    // Handle bullet points (lines starting with • or -)
                    if (paragraph.trim().startsWith('•') || paragraph.trim().startsWith('-')) {
                      return (
                        <div key={index} className="pl-4">
                          <Link 
                            href="#" 
                            className="block text-primary hover:underline"
                          >
                            {paragraph.trim()}
                          </Link>
                        </div>
                      );
                    }

                    // Handle section headings (assuming they end with '?')
                    if (paragraph.trim().endsWith('?') && paragraph.length < 100) {
                      return (
                        <h2 key={index} className="text-2xl font-serif font-bold mt-8 mb-4">
                          {paragraph.trim()}
                        </h2>
                      );
                    }

                    // Regular paragraphs
                    return (
                      <p key={index} className="text-base leading-relaxed">
                        {paragraph.trim()}
                      </p>
                    );
                  })}
                </div>

                {/* Related Links - Only show if there are bullet points */}
                {article.description?.split('\n').some((line: string) => 
                  line.trim().startsWith('•') || line.trim().startsWith('-')
                ) && (
                  <div className="space-y-2 my-8">
                    {article.description?.split('\n')
                      .filter((line: string) => line.trim().startsWith('•') || line.trim().startsWith('-'))
                      .map((link: string, index: number) => (
                        <Link 
                          key={index}
                          href="#" 
                          className="block text-primary hover:underline"
                        >
                          {link.trim()}
                        </Link>
                      ))}
                  </div>
                )}
              </motion.div>

              {/* Random Article Section */}
              <motion.div 
                className="mt-16 pt-16 border-t-2 border-border"
                variants={fadeInUp}
              >
                <motion.h2 
                  className="text-3xl font-serif font-bold mb-8"
                  variants={slideIn}
                >
                  You Might Be Interested In
                </motion.h2>
                {(() => {
                  const randomArticle = getRandomElement(relatedNews);
                  return randomArticle && (
                    <motion.article 
                      className="space-y-8"
                      variants={fadeInUp}
                    >
                      {/* Random Article Header */}
                      <motion.header 
                        className="border-b border-border/60 pb-6"
                        variants={slideIn}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant="outline" className="font-serif">
                            {randomArticle.type}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 inline mr-1" />
                            {formatDate(new Date(randomArticle.created_datetime || Date.now()))}
                          </div>
                        </div>
                        <Link href={`/view/${randomArticle.articleId}`}>
                          <h1 className="text-2xl md:text-3xl font-serif font-bold leading-tight mb-4 hover:text-primary transition-colors">
                            {randomArticle.title}
                          </h1>
                        </Link>
                      </motion.header>

                      {/* Random Article Featured Image */}
                      <motion.figure 
                        className="my-8"
                        variants={fadeInUp}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="aspect-video rounded-lg overflow-hidden">
                          <img
                            src={randomArticle.lphoto}
                            alt={randomArticle.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </motion.figure>

                      {/* Random Article Description */}
                      <motion.div 
                        className="space-y-6"
                        variants={fadeInUp}
                      >
                        <div className="text-lg text-muted-foreground leading-relaxed">
                          {randomArticle.description?.split('.')[0] + '.'}
                        </div>
                        <div className="space-y-4">
                          {randomArticle.description?.split('\n')
                            .slice(1, 3)
                            .map((paragraph: string, index: number) => (
                              <p key={index} className="text-base leading-relaxed text-muted-foreground">
                                {paragraph}
                              </p>
                          ))}
                        </div>
                      </motion.div>

                      {/* Continue Reading Button */}
                      <motion.div 
                        className="mt-8"
                        variants={fadeInUp}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link href={`/view/${randomArticle.articleId}`}>
                          <Button
                            variant="default"
                            className="bg-primary/90 hover:bg-primary"
                          >
                            Continue Reading
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </motion.div>
                    </motion.article>
                  );
                })()}
              </motion.div>

              {/* Key Points Section - Only show if there's a question heading */}
              {article.description?.split('\n').some((line: string) => 
                line.trim().endsWith('?') && line.length < 100
              ) && (
                <div className="my-8 p-6 bg-muted/10 rounded-lg border-l-4 border-primary/20">
                  <h3 className="font-serif text-xl font-bold mb-4">
                    {article.description?.split('\n')
                      .find((line: string) => line.trim().endsWith('?') && line.length < 100)
                      ?.trim()}
                  </h3>
                  <ul className="space-y-4">
                    {article.description?.split('\n')
                      .filter((line: string) => 
                        line.trim() && 
                        !line.trim().endsWith('?') && 
                        !line.trim().startsWith('•') &&
                        !line.trim().startsWith('-') &&
                        line.length < 200
                      )
                      .slice(0, 3)
                      .map((point: string, index: number) => (
                        <li key={index} className="flex items-start gap-3 text-muted-foreground">
                          <span className="text-primary font-bold">•</span>
                          <span>{point.trim()}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

                {/* Additional Content Section */}
                <div className="mt-12 pt-8 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Key Takeaways */}
                    <div className="bg-muted/30 rounded-lg p-6">
                      <h3 className="font-serif text-xl font-bold mb-4">Key Takeaways</h3>
                      <ul className="space-y-3 text-base">
                      {article.description?.split('\n')
                        .filter((line: string) => 
                          line.trim() && 
                          !line.trim().startsWith('•') && 
                          !line.trim().startsWith('-') &&
                          line.length < 150
                        )
                        .slice(0, 3)
                        .map((point: string, index: number) => (
                          point.trim() && (
                            <li key={index} className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span className="text-muted-foreground">{point.trim()}</span>
                            </li>
                          )
                        ))}
                      </ul>
                    </div>

                    {/* Related Topics */}
                    <div className="bg-muted/30 rounded-lg p-6">
                      <h3 className="font-serif text-xl font-bold mb-4">Related Topics</h3>
                      <div className="flex flex-wrap gap-2">
                      {Array.from(new Set([article.type, ...categoryNews.map(news => news.type)]))
                        .filter(Boolean)
                        .map((topic: string, index: number) => (
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

              {/* Random News Section */}
              <div className="mt-16 border-t border-border pt-12">
                <h2 className="font-serif text-3xl font-bold mb-8">More From The Bombay Forum</h2>
                <div className="grid grid-cols-1 gap-12">
                  {/* Featured Random Article */}
                  {getRandomElement(relatedNews) && (
                    <div className="group">
                      <Link href={`/view/${getRandomElement(relatedNews)?.articleId}`}>
                        <div className="aspect-[16/9] rounded-xl overflow-hidden mb-6">
                          <img
                            src={getRandomElement(relatedNews)?.lphoto}
                            alt={getRandomElement(relatedNews)?.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="space-y-3">
                          <Badge variant="outline" className="font-serif">
                            {getRandomElement(relatedNews)?.type}
                          </Badge>
                          <h3 className="text-2xl font-serif font-bold group-hover:text-primary transition-colors">
                            {getRandomElement(relatedNews)?.title}
                          </h3>
                          <p className="text-muted-foreground line-clamp-2">
                            {getRandomElement(relatedNews)?.description}
                          </p>
                        </div>
                      </Link>
                    </div>
                  )}

                  {/* Grid of Random Articles */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {relatedNews.slice(0, 3).map((randomArticle) => (
                      <Link
                        key={randomArticle.articleId}
                        href={`/view/${randomArticle.articleId}`}
                        className="group"
                      >
                        <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4">
                          <img
                            src={randomArticle.sphoto}
                            alt={randomArticle.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="space-y-2">
                          <Badge variant="outline" className="font-serif text-xs">
                            {randomArticle.type}
                          </Badge>
                          <h4 className="font-serif text-lg font-medium line-clamp-2 group-hover:text-primary transition-colors">
                            {randomArticle.title}
                          </h4>
                          <div className="text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 inline mr-1" />
                            {formatDate(new Date(randomArticle.created_datetime || Date.now()))}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Latest Updates in Category */}
              <div className="mt-16 border-t border-border pt-12">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-serif text-2xl font-bold">Latest in {article.type}</h2>
                  <Link 
                    href={`/category/${article.type.toLowerCase()}`}
                    className="text-primary hover:underline font-medium flex items-center gap-1"
                  >
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {categoryNews.slice(0, 4).map((categoryArticle) => (
                    <Link
                      key={categoryArticle.articleId}
                      href={`/view/${categoryArticle.articleId}`}
                      className="group"
                    >
                      <Card className="flex gap-6 p-4 hover:bg-accent/5 transition-all duration-300">
                        <div className="w-32 aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={categoryArticle.sphoto}
                            alt={categoryArticle.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex-1 min-w-0 py-2">
                          <Badge variant="outline" className="mb-2 font-serif text-xs">
                            {categoryArticle.type}
                          </Badge>
                          <h4 className="font-serif text-lg font-medium mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {categoryArticle.title}
                          </h4>
                          <div className="text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 inline mr-1" />
                            {formatDate(new Date(categoryArticle.created_datetime || Date.now()))}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
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
          </motion.article>

          {/* Sidebar */}
          <motion.aside 
            className="lg:col-span-4"
            variants={fadeInUp}
          >
            <motion.div 
              className="lg:sticky lg:top-8 space-y-8"
              variants={staggerChildren}
            >
              {/* Article Info */}
              <motion.div 
                variants={slideIn}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-6">
                  <h3 className="font-serif text-xl font-bold mb-4">About This Article</h3>
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
                    <div>
                      <dt className="text-sm text-muted-foreground">Author</dt>
                      <dd className="font-medium">{article.author?.name || 'Rafiqul Islam'}</dd>
                  </div>
                </dl>
              </Card>
              </motion.div>

              {/* Trending Articles */}
              <motion.div 
                variants={slideIn}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-6">
                  <h3 className="font-serif text-xl font-bold mb-6">Trending Now</h3>
                <div className="space-y-6">
                    {trendingNews.slice(0, 5).map((trendingArticle, index) => (
                    <Link
                        key={trendingArticle.articleId}
                        href={`/view/${trendingArticle.articleId}`}
                        className="group block"
                      >
                        <div className="flex gap-4">
                          <div className="w-20 aspect-square flex-shrink-0 rounded-lg overflow-hidden">
                            <img
                              src={trendingArticle.sphoto}
                              alt={trendingArticle.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                          <div className="flex-1 min-w-0">
                            <Badge variant="outline" className="mb-2 font-serif text-xs">
                              {trendingArticle.type}
                          </Badge>
                            <h4 className="font-serif text-base font-medium line-clamp-2 group-hover:text-primary transition-colors">
                              {trendingArticle.title}
                            </h4>
                          </div>
          </div>
                        {index < trendingNews.length - 1 && (
                          <div className="my-6 border-t border-border" />
                      )}
                    </Link>
                  ))}
                </div>
              </Card>
              </motion.div>
            </motion.div>
          </motion.aside>
        </motion.div>
      </main>
    </div>
  );
}
