import NewsBlock, { SkeletonNewsBlock } from "./NewsBlock";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function RightBsideNews({ latestNews }) {
  return (
    <Card className="p-4 bg-card">
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-2 pb-2 border-b border-border">
          <Clock className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-semibold">Latest News</h2>
        </div>
        <div className="space-y-4">
          {latestNews.length === 0 &&
            Array(5)
              .fill(0)
              .map((_, i) => <SkeletonNewsBlock key={`n${i}`} />)}
          {latestNews.map((article, i) => (
            <div key={`n${i}`}>
              <NewsBlock news={article} />
              {i < latestNews.length - 1 && (
                <div className="my-4 border-t border-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
