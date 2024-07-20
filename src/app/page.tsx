"use client";
import "/assets/css/Home.scss";
import LeftAsideNews from "./components/LeftAsideNews";
import RightBsideNews from "./components/RightBsideNews";
import SearchBar from "material-ui-search-bar";

import React, { useState } from 'react';

export default function Home() {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    console.log(searchValue); // Replace with your search handling logic
  };

  return (
    <main>
      <div className="container">
        <div className="header">Header</div>
        <LeftAsideNews />
        
        <main
          className="main"
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          {/* <h3>Main Content</h3> */}
          {/* <div id="dimensions">
            Width: <span id="width"></span>, Height: <span id="height"></span>
          </div> */}
          <div className="content-card">
      <img src="/images/news1.jpg" alt="title" className="content-card__image" />
      <div className="content-card__content">
        <h3 className="content-card__title">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Adipisci labore tempore inventore corporis libero possimus, modi quidem ipsa debitis assumenda sunt aliquam voluptate voluptatum. Blanditiis eveniet voluptatum animi natus ipsum.</h3>
        <p className="content-card__description">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore, tempora!</p>
      </div>
    </div>

        </main>
        <section className="banner">
        <SearchBar
      value={searchValue}
      onChange={(newValue) => setSearchValue(newValue)}
      onRequestSearch={handleSearch}
    />
        </section>
        <aside className="right-aside">
          <RightBsideNews/>
        </aside>
        <section className="low-content">Low Content</section>
        <div className="footer">Footer</div>
      </div>
    </main>
  );
}
