"use client";
import "/assets/css/Home.scss";
import LeftAsideNews from "./components/LeftAsideNews";
import RightBsideNews from "./components/RightBsideNews";
import SearchBar from "material-ui-search-bar";

import React, { useEffect, useState } from "react";
import NewsBlock from "./components/NewsBlock";
import MarketTicker from "./components/MarketTicker";
import Link from "next/link";
import SearchableDropdown from "./components/SearchableDropdown";

interface news {
  articleId: string;
  description: string;
  lphoto: string;
  sphoto: string;
  title: string;
  type: string;
}

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [mainNewsContainer, setMainNewsContainer] = useState<news[]>([]);
  const [latestNews, setLatestNews] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);

  useEffect(() => {
    const fetchMainNewsArticle = async () => {
      try {
        const articleType = localStorage.getItem("articleType");
        const response = await fetch(
          `/api/searcharticles?articleType=${
            articleType ? articleType : "random"
          }&num=9&randomize=true`
        );
        const data = await response.json();
        if (response.ok) {
          setMainNewsContainer(data);
          // Store category in localStorage
          if (data.type) {
            localStorage.setItem("articleType", data.type);
          }
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      } finally {
        // setLoading(false);
      }
    };
    const fetchTrendingNewsArticle = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?num=20&randomize=true`
        );
        let data = await response.json();
        if (response.ok) {
          data = data.slice(0, 10);
          setTrendingNews(data);
          // Store category in localStorage
          if (data.type) {
            localStorage.setItem("articleType", data.type);
          }
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      } finally {
        // setLoading(false);
      }
    };

    const fetchLatestNewsArticle = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?articleType=random&num=10&order=DESC`
        );
        const data = await response.json();
        if (response.ok) {
          setLatestNews(data);
          // Store category in localStorage
          if (data.type) {
            localStorage.setItem("articleType", data.type);
          }
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchMainNewsArticle();
    fetchTrendingNewsArticle();
    fetchLatestNewsArticle();
  }, []);

  useEffect(() => {
    const fetchSearchOptions = async () => {
      try {
        const response = await fetch(
          `/api/searcharticles?query=${encodeURIComponent(searchValue)}`
        );
        const data = await response.json();
        if (response.ok) {
          setSearchOptions(data);
        } else {
          setSearchOptions([]);
        }
      } catch (error) {
        setSearchOptions([]);
        console.error("Failed to fetch article:", error);
      } finally {
        // setLoading(false);
      }
    };
    fetchSearchOptions();
  }, [searchValue]);

  console.log({ searchOptions });
  console.log({ searchValue });

  console.log({ mainNewsContainer });

  const handleSearch = () => {
    console.log(searchValue); // Replace with your search handling logic
  };

  return (
    <main>
      <div className="search-bar-wrapper">
        {/* <SearchBar
          value={searchValue}
          onChange={(newValue) => setSearchValue(newValue)}
          onRequestSearch={handleSearch}
        /> */}
        <SearchableDropdown
          options={searchOptions}
          label="title"
          id="id"
          selectedVal={searchValue}
          handleChange={(val: string) => {
            console.log({ val });

            setSearchValue(val);
          }}
        />
      </div>
      <MarketTicker data="hello" />
      <div className="container">
        <LeftAsideNews trendingNews={trendingNews} />

        <div
          className="home-main"
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <div className="content-card">
            <img
              src={mainNewsContainer[0]?.lphoto}
              alt="title"
              className="content-card__image"
            />
            <div className="content-card__content">
              <h3 className="content-card__title">
                {mainNewsContainer[0]?.title}
              </h3>
              <p className="content-card__description">
                {mainNewsContainer[0]?.description}
              </p>
              <a href={`/view/${mainNewsContainer[0]?.articleId || ""}`}>
                <p className="content-card__see-more">See More</p>
              </a>
            </div>
          </div>
          <div className="more-main-news">
            {mainNewsContainer.slice(1).map((news, i) => (
              <>
                <hr />
                <NewsBlock news={news} key={i} />
              </>
            ))}
          </div>
        </div>
        <aside className="right-aside">
          <RightBsideNews latestNews={latestNews} />
          {/* <RightBsideNews /> */}
        </aside>
        <div className="footer" style={{ display: "none" }}>
          Footer
        </div>
      </div>
    </main>
  );
}
