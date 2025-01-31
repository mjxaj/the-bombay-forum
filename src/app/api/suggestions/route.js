import { NextResponse } from "next/server";
import db from "../../../../db"; // Update the path to your db file
import fs from "fs";
import path from "path";

// Function to log errors to a file
function logErrorToFile(error) {
  const logMessage = `${new Date().toISOString()} - ${error.message}\n${
    error.stack
  }\n\n`;
  const logFilePath = path.join(process.cwd(), "error.log");

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Failed to write to log file:", err);
    }
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const num = parseInt(searchParams.get("num")) || 10; // Limit the number of suggestions

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: "Query must be at least 2 characters long" },
      { status: 400 }
    );
  }

  try {
    const sql =
      "SELECT DISTINCT Title FROM news WHERE Deleted = false AND Title LIKE ? LIMIT ?";
    const params = [`%${query}%`, num];

    const [titles] = await db.query(sql, params);

    if (titles.length === 0) {
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = titles.map((item) => {
      const regex = new RegExp(`(${query})`, "gi");
      const highlightedTitle = item.Title.replace(regex, "<b>$1</b>");
      return { title: item.Title, highlighted: highlightedTitle };
    });

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error fetching article title suggestions:", error);
    logErrorToFile(error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}
