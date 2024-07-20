"use client";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import "../../../assets/css/SpecificArticleDesign1.scss";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const router = useRouter();
  return (
    <div className="specific-article-design1">
      <div className="header">
        <div className="go-back" onClick={() => router.back()}>
          <ArrowBackIosNewIcon style={{ fontSize: "10px" }} />
        </div>
        <div className="date-title">
          <div className="date">May 28, 2024</div>
          <div className="title">
            International Space Station Crew Rescued After Emergeny
          </div>
        </div>
      </div>
      <div className="body">
        <div className="image">
          <img src="/images/news10.jpg" alt="International Space Station" />
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
          malesuada, urna nec pharetra tincidunt, nulla nisl tempor ex, et
          facilisis lorem nisl eget nunc. Donec nec tellus nec purus condimentum
          ultricies. Proin auctor, libero nec volutpat sollicitudin, nunc elit
          luctus mi, nec lacinia ligula justo vitae purus. Ut in justo eget nunc
          tincidunt ultricies. Vestibulum tincidunt, mi nec ultricies tincidunt,
          libero odio ultricies libero, vitae ultricies libero nulla nec mi.
          Nullam nec purus quis libero ultricies tincidunt. Donec nec tellus nec
          purus condimentum ultricies. Proin auctor, libero nec volutpat
          sollicitudin, nunc elit luctus mi, nec lacinia ligula justo vitae
          purus. Ut in justo eget nunc tincidunt ultricies. Vestibulum
          tincidunt, mi nec ultricies tincidunt, libero odio ultriciesq libero,
          vitae ultricies libero nulla nec mi. Nullam nec purus quis libero
          ultricies tincidunt.
        </p>
        <div className="image">
          <img src="/images/news11.jpg" alt="International Space Station" />
          <div className="caption">IMAGE CAPTION OR CREDIT</div>
        </div>
        <p>
          Donec nec tellus nec purus condimentum ultricies. Proin auctor, libero
          nec volutpat sollicitudin, nunc elit luctus mi, nec lacinia ligula
          justo vitae purus. Ut in justo eget nunc tincidunt ultricies.
          Vestibulum tincidunt, mi nec ultricies tincidunt, libero odio
          ultricies libero, vitae ultricies libero nulla nec mi. Nullam nec
          purus quis libero ultricies tincidunt. Donec nec tellus nec purus
          condimentum ultricies. Proin auctor, libero nec volutpat sollicitudin,
          nunc elit luctus mi, nec lacinia ligula justo vitae purus.
        </p>
        <hr />
        <h2>Other Trending News</h2>
        <div className="other-news">
          <div className="other-news-block">
            <div className="content">
              <div className="date-parent">
                <span className="ribbon">WEEKLY UPDATES</span>
                <span className="date">May 28, 2024</span>
              </div>
              <div className="title">
                International Space Station Crew Rescued After Emergeny
              </div>
              <div className="body">
                Redefined the user acquisition and redesigned the onboarding
                experience, all within 3 working weeks.
              </div>
            </div>
            <div className="image">
              <img src="/images/news1.jpg" alt="International Space Station" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
