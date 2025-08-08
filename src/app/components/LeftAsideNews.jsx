import NewsBlock, { SkeletonNewsBlock } from "./NewsBlock";
import "../../../assets/css/Home.scss";
import Image from "next/image";
import Link from "next/link";

export default function LeftAsideNews({ trendingNews }) {
  return (
    <aside className="left-aside">
      <Link
        href="https://wa.me/919226167634?text=Hello%2C%20can%20I%20get%20more%20info%20on%20this%20news%3F"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="advertisement-custom hide-on-mobile">
          <div className="title">Sponsored</div>
          <Image
            src="/mjx-ad.jpg"
            alt="Advertisement"
            width={800}
            height={200}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </Link>

      <div className="left-aside__news">
        <div className="new-list-block">
          <div className="heading">Trending News</div>
          <div className="body">
            {trendingNews.length === 0 &&
              Array(5)
                .fill(0)
                .map((_, i) => <SkeletonNewsBlock key={`n${i}`} />)}
            {trendingNews.map((article, i) => (
              <>
                <NewsBlock news={article} key={`n${i}`} showImage={false} />
                <hr key={`h${i}`} />
              </>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
