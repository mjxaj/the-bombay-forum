import "/assets/css/Home.scss";
import NewsBlock from "./NewsBlock";
export default function RightAsideNews({ latestNews }) {
  return (
    <aside className="left-aside">
      <div className="new-list-block">
        <div className="heading">Latest News</div>
        <div className="body">
          {latestNews.map((article, i) => (
            <>
              <NewsBlock news={article} key={`n${i}`} />
              <hr key={`n${i}`} />
            </>
          ))}
        </div>
      </div>
    </aside>
  );
}
