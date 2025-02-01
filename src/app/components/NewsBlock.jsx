import Link from "next/link";
import { formatDate, timeAgo } from "@/app/utilfunctions/dateFormatter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Markdown } from "@/components/ui/markdown";

export function SkeletonNewsBlock() {
  return (
    <Card className="p-4 animate-pulse">
      <div className="flex items-center space-x-2 mb-3">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="mt-3">
        <Skeleton className="h-5 w-16" />
      </div>
    </Card>
  );
}

export default function NewsBlock({ news, showImage = true }) {
  return (
    <Link href={`/view/${news.articleId}`} className="block group">
      <Card className="p-4 transition-all duration-200 hover:bg-accent/5 bg-card border shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {formatDate(new Date(news.date))}
          </span>
        </div>
        <div className="flex gap-4">
          {showImage && news.lphoto && (
            <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={news.lphoto}
                alt={news.title}
                className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
              />
            </div>
          )}
          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {news.title}
            </h3>
            {news.description && (
              <div className="line-clamp-2">
                <Markdown 
                  content={news.description}
                  className="text-xs text-muted-foreground"
                />
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            {timeAgo(new Date(news.date))}
          </Badge>
          {news.type && (
            <Badge variant="outline" className="text-xs">
              {news.type}
            </Badge>
          )}
        </div>
      </Card>
    </Link>
  );
}
