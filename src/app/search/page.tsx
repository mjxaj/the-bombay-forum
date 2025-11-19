"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "material-ui-search-bar";
import { news } from "../utilfunctions/interfaces";
import { articleAPI } from "../utilfunctions/api";
import ExploreLayout from "../components/ExploreLayout";

export default function SearchPage() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<news[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const data = await articleAPI.getArticles({
          query: searchValue,
          num: 20
        });
        setSearchResults(data);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchValue]);

  return (
    <div className="search-page">
      <div className="search-bar-wrapper">
        <SearchBar
          className="searchbar"
          style={{ width: "90%", maxWidth: "500px", borderRadius: "50px" }}
          value={searchValue}
          onChange={(newValue) => setSearchValue(newValue)}
          onCancelSearch={() => setSearchValue("")}
          placeholder="Search News, creators, photos, videos...."
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ExploreLayout
          articles={searchResults}
          zeroArticleMsg={`No Articles Found for "${searchValue}"`}
        />
      )}
    </div>
  );
}
