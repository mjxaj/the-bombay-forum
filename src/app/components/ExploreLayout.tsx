import { NextPage } from "next";
import { news } from "@/app/utilfunctions/interfaces";
import Masonry from "react-masonry-css";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { formatDate } from "@/app/utilfunctions/dateFormatter";

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

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {articles.map((article) => (
          <Link 
            key={article.articleId} 
            href={`/view/${article.articleId}`}
            className="block group"
          >
            <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-200">
              <div className="relative h-48">
                <img
                  src={article.sphoto}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary" className="text-xs">
                    {article.type}
                  </Badge>
                </div>
                <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
