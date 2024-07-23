import { NextResponse } from 'next/server';
import { pool } from '../../../../../db'; // Update the path to your db file

export async function GET(request: Request, { params }: { params: { articleId: string } }) {
  const { articleId } = params;

  try {
    const [rows] = await pool.query('SELECT * FROM news WHERE ArticleId = ?', [articleId]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const article = rows[0];
    return NextResponse.json({
      title: article.Title,
      description: article.Description,
      sphoto: article.Sphoto,
      lphoto: article.Lphoto,
      articleId: article.ArticleId,
      type: article.Type,
      date: article.Date // Adjust based on your actual database schema
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}
