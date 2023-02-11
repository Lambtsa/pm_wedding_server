import {
  CustomApiErrorMessages,
  DbConflictError,
  DbInsertError,
} from "@core/errors";
import { Translation } from "@types";
import { Knex } from "knex";

export const insert = async (
  context: Express.RequestContext,
  input: Pick<Translation, "title" | "description" | "news_id" | "language">,
  tx: Knex.Transaction,
): Promise<Translation> => {
  context.log.info("Inserting into Translation table", { input });

  const [translation] = await context
    .db<Translation>("translations")
    .insert({
      news_id: input.news_id,
      title: input.title,
      description: input.description,
      language: input.language,
    })
    .transacting(tx)
    .returning("*")
    .catch((err: Record<any, any>) => {
      /* @see https://eslint.org/docs/latest/rules/no-prototype-builtins */
      if (
        Object.prototype.hasOwnProperty.call(err, "constraint") &&
        !!err.constraint
      ) {
        throw new DbConflictError(CustomApiErrorMessages.TranslationConflict);
      } else {
        throw new DbInsertError(err.message);
      }
    });

  if (!translation) {
    throw new DbInsertError("There was an error while adding the translation");
  }

  return translation;
};
