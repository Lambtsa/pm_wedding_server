import { News } from "@types";
import { Knex } from "knex";

interface InsertProps {
  db: Knex<any, unknown[]>;
}

export const select = async ({ db }: InsertProps): Promise<News[]> => {
  const search = await db
    .select("*")
    .from<News>("news")
    .orderBy("created_at", "desc")
    .limit(3);

  return search;
};
