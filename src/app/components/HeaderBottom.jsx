"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "material-ui-search-bar";
import Link from "next/link";
import Weather from "./Weather";

const navList = [
  { name: "Lifestyle", link: "/category/lifestyle" },
  { name: "Finance", link: "/category/finance" },
  { name: "Creators", link: "/category/creators" },
  { name: "Technology", link: "/category/technology" },
  { name: "Bombay", link: "/category/bombay" },
];

const HeaderBottom = () => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  return (
    <div className="header-bottom">
      <Weather />
      <div className="search-bar-wrapper">
        <SearchBar
          className="searchbar"
          style={{
            width: "90%",
            maxWidth: "500px",
            borderRadius: "50px",
          }}
          // value={searchValue}
          // onChange={(newValue) => setSearchValue(newValue)}
          // onCancelSearch={() => setSearchValue("")}
          placeholder="Search News, creators, photos, videos...."
        />
      </div>
    </div>
  );
};

export default HeaderBottom;
