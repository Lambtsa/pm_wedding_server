import { DbInsertError } from "@core/errors";
import { News } from "@types";
import { Knex } from "knex";
import { v4 as uuid } from "uuid";

interface InsertProps {
  db: Knex<any, unknown[]>;
  input: Pick<News, "title" | "description" | "emoji">;
  trx: Knex.Transaction;
}

export const insert = async ({
  db,
  input,
  trx,
}: InsertProps): Promise<News> => {
  const search = await db<News>("news")
    .insert({
      id: uuid(),
      title: input.title,
      description: input.description,
      emoji: input.emoji,
    })
    .transacting(trx)
    .returning("*");

  if (!search[0]) {
    throw new DbInsertError("There was an error while adding the news");
  }

  return search[0];
};
