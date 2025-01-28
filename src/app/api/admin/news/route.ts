import { NextResponse } from "next/server";
import db from "../../../../../db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  // const session = await getServerSession(authOptions);

  // if (!session || session.user?.role !== "admin") {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  // }

  try {
    const data = await request.json();
    const { title, description, sphoto, lphoto, type, source, sourceLink, link } = data;

    // Generate articleId if not provided
    const articleId = data.articleId || uuidv4();

    // Insert into database
    const [result] = await db.execute(
      `INSERT INTO news (ArticleId, Title, Description, Sphoto, Lphoto, Type, Source, SourceLink, Link) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [articleId, title, description, sphoto, lphoto, type, source, sourceLink, link]
    );

    console.log("Inserted article ID:", result.insertId);

    return NextResponse.json({ message: "News added successfully" });
  } catch (error) {
    console.error("Error adding news:", error);
    return NextResponse.json({ error: "Failed to add news" }, { status: 500 });
  }
}