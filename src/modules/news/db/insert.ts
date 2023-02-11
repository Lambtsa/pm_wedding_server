import { DbInsertError } from "@core/errors";
import { News } from "@types";
import { Knex } from "knex";

export const insert = async (
  context: Express.RequestContext,
  input: Pick<News, "emoji">,
  tx: Knex.Transaction,
): Promise<News> => {
  context.log.info("Inserting into News table", { input });
  const [news] = await context
    .db<News>("news")
    .insert({
      emoji: input.emoji,
    })
    .transacting(tx)
    .returning("*");

  if (!news) {
    throw new DbInsertError("There was an error while adding the news");
  }

  return news;
};
