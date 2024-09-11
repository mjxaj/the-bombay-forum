"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./AdminPage.module.css"; 

interface FormData {
  ArticleId: string;
  Title: string;
  Description: string;
  sphoto: string;
  lphoto: string;
  type: string;
  source: string;
  sourceLink: string;
  link: string;
}

interface Article {
  id: number;
  ArticleId: string;
  Title: string;
  Description: string;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    ArticleId: "",
    Title: "",
    Description: "",
    sphoto: "",
    lphoto: "",
    type: "",
    source: "",
    sourceLink: "",
    link: ""
  });

  const [articles, setArticles] = useState<Article[]>([]); 



  useEffect(() => {
    console.log("Articles: ", articles);
  }, [articles]); 


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("News added successfully!");
        setFormData({
          ArticleId: "",
          Title: "",
          Description: "",
          sphoto: "",
          lphoto: "",
          type: "",
          source: "",
          sourceLink: "",
          link: ""
        });
        const newArticle = await res.json();
        console.log("New Article: ", newArticle);
        setArticles((prevArticles) => [...prevArticles, newArticle]); // Update articles list with new article
      } else {
        alert("Error adding news.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };


  // Check if user is an admin
  if (!session || session.user?.role !== "admin") {
    router.push("/");
    return null;
  }

  return (
    <div className={styles.container} style={{marginTop: "25px"}} >
      <h1 className={styles.heading}>Add News</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Form fields */}
        <input
          type="text"
          name="articleId"
          placeholder="Article ID"
          value={formData.ArticleId}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.Title}
          onChange={handleChange}
          className={styles.input}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.Description}
          onChange={handleChange}
          className={styles.textarea}
        />
        <input
          type="text"
          name="sphoto"
          placeholder="Small Photo URL"
          value={formData.sphoto}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="text"
          name="lphoto"
          placeholder="Large Photo URL"
          value={formData.lphoto}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="text"
          name="type"
          placeholder="Type"
          value={formData.type}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="text"
          name="source"
          placeholder="Source"
          value={formData.source}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="text"
          name="sourceLink"
          placeholder="Source Link"
          value={formData.sourceLink}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="text"
          name="link"
          placeholder="Link"
          value={formData.link}
          onChange={handleChange}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Add News</button>
      </form>

      
    </div>
  );
}
