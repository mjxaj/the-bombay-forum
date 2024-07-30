import "./NewsBlock.scss";
import Link from "next/link";
import { formatDate, timeAgo } from "@/app/utilfunctions/dateFormatter";

export default function NewsBlock({ news }) {
  return (
    <>
      <span className="news-block-wrapper">
        <Link href={`/view/${news.articleId}`}>
          <div className="news-block">
            <div className="date">{formatDate(new Date(news.date))}</div>
            <div className="news">
              {news.lphoto && (
                <img className="imageright" src={news.lphoto} alt="news1" />
              )}
              <p style={{ marginLeft: news.sphoto ? "10px" : "" }}>
                {news.title}
              </p>
            </div>
            <div className="remark">Published on {timeAgo(new Date(news.date))}</div>
          </div>
        </Link>
      </span>
    </>
  );
}

export const SkeletonNewsBlock = () => {
  return (
    <div className="skeleton-news-block-wrapper">
      <div className="skeleton-news-block">
        <div className="skeleton-date"></div>
        <div className="skeleton-news">
          <div className="skeleton-image"></div>
          <div className="skeleton-title">
            <div className="loading-line"></div>
          </div>
        </div>
        <div className="skeleton-remark"></div>
      </div>
    </div>
  );
};
