import "./NewsBlock.scss";
import Link from "next/link";

export default function NewsBlock({ news }) {
  return (
    <>
      <span className="news-block-wrapper">
        <Link href={`/view/${news.articleId}`}>
          <div className="news-block">
            <div className="date">{news.date}</div>
            <div className="news">
              {news.lphoto && (
                <img className="imageright" src={news.lphoto} alt="news1" />
              )}
              <p style={{ marginLeft: news.sphoto ? "10px" : "" }}>
                {news.title}
              </p>
            </div>
            <div className="remark">Updates 2 hours ago</div>
          </div>
        </Link>
      </span>
    </>
  );
}
