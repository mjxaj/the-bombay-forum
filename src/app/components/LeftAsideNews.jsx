import NewsBlock from "./NewsBlock";
import "/assets/css/Home.scss";
export default function LeftAsideNews({ trendingNews }) {
  return (
    <aside className="left-aside">
      <div className="new-list-block">
        <div className="heading">Trending News</div>
        <div className="body">
          {trendingNews.map((article, i) => (
            <NewsBlock news={article} key={i} />
          ))}
        </div>
      </div>
    </aside>
  );
}
