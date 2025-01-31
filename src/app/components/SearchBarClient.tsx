// components/SearchBarClient.tsx
"use client";

import React from "react";
import { Search } from "lucide-react";

const SearchBarClient: React.FC = () => {
  return (
    <div className="header-search-bar">
      <Search />
    </div>
  );
};

export default SearchBarClient;
