import "/assets/css/Home.scss";
export default function LeftAsideNews() {
  return (
    <aside className="left-aside">
      <div className="new-list-block">
        <div className="heading">Trending News</div>
        <div className="body">
          <div className="news-block">
            <div className="date">27 May 2024</div>
            <div className="newsnewcontainer">
              <img className="imageright" src="/images/news6.jpg" alt="news1" />
              <div className="news">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam
                nisi aperiam odit.
              </div>
            </div>

            <div className="remark">Updates 2 hours ago</div>
          </div>
          <hr />
          <div className="news-block">
            <div className="date">27 May 2024</div>
            <div className="news">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem
              ipsum dolor sit amet consectetur, adipisicing elit. Omnis quam
              repellat assumenda! Ut dolore nam debitis, eos porro voluptas
              tempora. Repudiandae corporis accusamus modi qui veniam tempora
              excepturi animi illum.
            </div>
            <div className="remark">Updates 2 hours ago</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
