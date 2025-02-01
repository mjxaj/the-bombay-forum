import { NextPage } from "next";
import { news } from "@/app/utilfunctions/interfaces";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowUpRight } from "lucide-react";
import { formatDate } from "@/app/utilfunctions/dateFormatter";
import { Markdown } from "@/components/ui/markdown";

export default function Explore({
  articles,
  zeroArticleMsg = "No articles found",
}: {
  articles: news[];
  zeroArticleMsg: string;
}) {
  if (articles.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-lg text-muted-foreground">{zeroArticleMsg}</p>
        </div>
      </div>
    );
  }

  // Split articles into sections
  const featuredArticle = articles[0];
  const topStories = articles.slice(1, 4);
  const remainingArticles = articles.slice(4);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Featured Article - Large */}
        <div className="lg:col-span-8">
          <Link href={`/view/${featuredArticle.articleId}`} className="group">
            <div className="space-y-4">
              <img
                src={featuredArticle.lphoto}
                alt={featuredArticle.title}
                className="w-full aspect-[16/9] object-cover"
              />
              <div>
                <Badge variant="outline" className="mb-3 font-serif">
                  {featuredArticle.type}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-3 group-hover:text-primary/80 transition-colors">
                  {featuredArticle.title}
                </h1>
                {featuredArticle.description && (
                  <div className="text-lg text-muted-foreground leading-relaxed mb-3">
                    <Markdown 
                      content={featuredArticle.description}
                      className="line-clamp-3"
                    />
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {formatDate(new Date(featuredArticle.created_datetime || Date.now()))}
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Top Stories - Right Column */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="font-serif text-xl font-bold border-b border-border pb-2">Top Stories</h2>
          {topStories.map((article) => (
            <Link 
              key={article.articleId}
              href={`/view/${article.articleId}`}
              className="block group"
            >
              <div className="flex gap-4">
                <img
                  src={article.sphoto}
                  alt={article.title}
                  className="w-24 h-24 object-cover flex-shrink-0"
                />
                <div>
                  <h3 className="font-serif font-medium leading-snug mb-2 group-hover:text-primary/80 transition-colors">
                    {article.title}
                  </h3>
                  <div className="text-xs text-muted-foreground">
                    <Badge variant="outline" className="mr-2 font-serif">
                      {article.type}
                    </Badge>
                    <span className="inline-flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(new Date(article.created_datetime || Date.now()))}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Remaining Articles - Grid Layout */}
        <div className="lg:col-span-12 border-t border-border pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingArticles.map((article) => (
              <Link 
                key={article.articleId}
                href={`/view/${article.articleId}`}
                className="group"
              >
                <div className="space-y-3">
                  <div className="aspect-[4/3] overflow-hidden">
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
                    <h3 className="font-serif text-lg font-medium leading-snug mb-2 group-hover:text-primary/80 transition-colors">
                      {article.title}
                    </h3>
                    {article.description && (
                      <div className="text-sm text-muted-foreground mb-2">
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
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
