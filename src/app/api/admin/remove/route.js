import { NextResponse } from 'next/server';
import db from "../../../../../db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get('articleId');

  try {
    const [result] = await db.execute(
      "UPDATE news SET Deleted = true WHERE ArticleId = ?",
      [articleId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ message: "Article marked as deleted successfully" });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}