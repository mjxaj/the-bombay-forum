import { NextResponse } from "next/server";
import db from "../../../../../db"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

interface NewsData {
  articleId: string;
  title: string;
  description: string;
  sphoto: string;
  lphoto: string;
  type: string;
  source: string;
  sourceLink: string;
  link: string;
}

// POST method to add a new news article
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const data: NewsData = await request.json();
    const { articleId, title, description, sphoto, lphoto, type, source, sourceLink, link } = data;

    // Insert the news article into the database
    await db("news").insert({
      ArticleId: articleId,
      Title: title,
      Description: description,
      Sphoto: sphoto,
      Lphoto: lphoto,
      Type: type,
      Source: source,
      SourceLink: sourceLink,
      Link: link,
    });

    return NextResponse.json({ message: "News added successfully" });
  } catch (error) {
    console.error("Error adding news:", error);
    return NextResponse.json({ error: "Failed to add news" }, { status: 500 });
  }
}

