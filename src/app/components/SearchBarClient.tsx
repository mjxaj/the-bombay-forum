// components/SearchBarClient.tsx
"use client";

import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const SearchBarClient: React.FC = () => {
  return (
    <Button variant="ghost" size="icon" className="text-white hover:text-gray-300">
      <Search className="h-5 w-5" />
    </Button>
  );
};

export default SearchBarClient;
