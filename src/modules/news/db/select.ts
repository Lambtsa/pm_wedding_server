import { News } from "@types";

interface InsertProps {
  context: Express.RequestContext;
}

export const select = async ({
  context: { db, log },
}: InsertProps): Promise<News[]> => {
  log.info("Selecting the 3 last news articles");

  const search = await db
    .select("*")
    .from<News>("news")
    .orderBy("created_at", "desc")
    .limit(3);

  return search;
};
