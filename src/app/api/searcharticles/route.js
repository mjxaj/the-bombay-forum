import { NextResponse } from 'next/server';
import db from '../../../../db'; // Update the path to your db file
import fs from 'fs';
import path from 'path';

// Function to log errors to a file
function logErrorToFile(error) {
  const logMessage = `${new Date().toISOString()} - ${error.message}\n${error.stack}\n\n`;
  const logFilePath = path.join(process.cwd(), 'error.log');

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
}

// Function to truncate the description if needed
function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const articleId = searchParams.get('articleId');
  let articleType = searchParams.get('articleType');
  const num = parseInt(searchParams.get('num')) || 5;
  const sortBy = searchParams.get('sortBy') || 'created_datetime'; // Sort by date
  const order = searchParams.get('order') || 'DESC'; // Default to descending order
  const randomize = searchParams.get('randomize') === 'true';
  const fullDescription = searchParams.get('fullDescription') === 'true'; // Flag for full or truncated description
  const descriptionMaxLength = 200; // Default max length for truncated descriptions

  try {
    let sql = 'SELECT * FROM news WHERE Deleted = false';
    const params = [];

    // Handle `query` filtering
    if (query) {
      sql += ' AND (Title LIKE ? OR Description LIKE ?)';
      params.push(`%${query}%`, `%${query}%`);
    }

    // Handle `articleId` filtering
    if (articleId) {
      sql += ' AND ArticleId = ?';
      params.push(articleId);
    }

    // Handle `articleType` filtering
    if (articleType === 'random') {
      const [types] = await db.query('SELECT DISTINCT Type FROM news WHERE Deleted = false');
      if (types.length > 0) {
        const randomType = types[Math.floor(Math.random() * types.length)];
        articleType = randomType.Type;
      } else {
        articleType = null;
      }
    }

    if (articleType) {
      sql += ' AND Type = ?';
      params.push(articleType);
    }

    // Apply sorting and randomization
    if (randomize) {
      sql += ' ORDER BY RAND()';
    } else {
      sql += ` ORDER BY ${sortBy} ${order}`;
    }

    // Apply limit
    sql += ' LIMIT ?';
    params.push(num);

    const [articles] = await db.query(sql, params);

    if (articles.length === 0) {
      return NextResponse.json({ error: 'No articles found' }, { status: 404 });
    }

    const response = articles.map((article) => ({
      title: article.Title,
      description: fullDescription
        ? article.Description
        : truncateText(article.Description, descriptionMaxLength),
      sphoto: article.Sphoto,
      lphoto: article.Lphoto,
      articleId: article.ArticleId,
      type: article.Type,
      date: article.created_datetime,
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching articles:', error);
    logErrorToFile(error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}
