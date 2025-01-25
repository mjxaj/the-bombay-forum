import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { articleId } = req.query;

  if (req.method === "DELETE") {
    try {
      const [result] = await db.execute("DELETE FROM news WHERE ArticleId = ?", [articleId]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Article not found" });
      }

      res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ error: "Failed to delete article" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
