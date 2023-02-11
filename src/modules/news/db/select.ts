import { News } from "@types";

interface InsertProps {
  context: Express.RequestContext;
}

export const select = async ({
  context: { db, log },
}: InsertProps): Promise<News[]> => {
  log.info("Selecting the 3 last news articles");

  const search = await db
    .select(
      "news.id as id",
      "translations.title as title",
      "translations.description as description",
      "translations.language as language",
      "news.emoji as emoji",
      "news.created_at as created_at",
    )
    .from<News>("news")
    .innerJoin("translations", "news.id", "translations.news_id")
    .orderBy("news.created_at", "desc")
    .limit(3);

  return search;
};
