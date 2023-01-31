import {
  CustomApiErrorMessages,
  DbConflictError,
  DbInsertError,
} from "@core/errors";
import { News } from "@types";
import { Knex } from "knex";
import { v4 as uuid } from "uuid";

interface InsertProps {
  context: Express.RequestContext;
  input: Pick<News, "title" | "description" | "emoji">;
}

export const insert = async ({
  context: { db, log },
  input,
}: InsertProps): Promise<News> =>
  await db.transaction(async (trx: Knex.Transaction) => {
    log.info("Inserting into News table", { input });
    const search = await db<News>("news")
      .insert({
        id: uuid(),
        title: input.title,
        description: input.description,
        emoji: input.emoji,
      })
      .transacting(trx)
      .returning("*")
      .catch((err: Record<any, any>) => {
        /* @see https://eslint.org/docs/latest/rules/no-prototype-builtins */
        if (
          Object.prototype.hasOwnProperty.call(err, "constraint") &&
          !!err.constraint
        ) {
          throw new DbConflictError(
            CustomApiErrorMessages.NewsDescriptionConflict,
          );
        } else {
          throw new DbInsertError(err.message);
        }
      });

    if (!search[0]) {
      throw new DbInsertError("There was an error while adding the news");
    }

    return search[0];
  });
