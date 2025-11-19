"use client";
import { news } from "@/app/utilfunctions/interfaces";
import { articleAPI } from "@/app/utilfunctions/api";
import { useEffect, useState } from "react";
import Explore from "../../components/ExploreLayout";

export default function Search({
  params,
}: {
  params: { articleType: string };
}) {
  const [newsContainer, setNewsContainer] = useState<news[]>([]);
  useEffect(() => {
    const fetchMainNewsArticle = async () => {
      try {
        const data = await articleAPI.getArticles({
          articleType: params.articleType,
          num: 20
        });
        setNewsContainer(data);
        // Store category in localStorage
        if (data.length > 0) {
          localStorage.setItem("articleType", params.articleType);
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      }
    };

    fetchMainNewsArticle();
  }, [params.articleType]);

  return (
    <>
      <Explore
        articles={newsContainer}
        zeroArticleMsg={`No Articles Found for ${params.articleType}`}
      />
    </>
  );
}
