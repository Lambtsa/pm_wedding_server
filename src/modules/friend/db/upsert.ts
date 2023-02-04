import {
  CustomApiErrorMessages,
  DbConflictError,
  DbInsertError,
} from "@core/errors";
import { Friend } from "@types";
import { Knex } from "knex";
import { v4 as uuid } from "uuid";

interface InsertProps {
  context: Express.RequestContext;
  input: Pick<Friend, "name" | "email" | "activities">;
}

export const upsert = async ({
  context: { db, log },
  input,
}: InsertProps): Promise<Friend> =>
  await db.transaction(async (trx: Knex.Transaction) => {
    log.info("Upserting into Friends table", { input });

    /* ############################## */
    /*  */
    /* ############################## */
    const existingFriend = await db<Friend>("friends")
      .where("email", input.email)
      .first();

    let qb = db<Friend>("friends")
      .where("email", input.email)
      .first()
      .transacting(trx)
      .forUpdate();

    if (!existingFriend) {
      qb.insert({
        id: uuid(),
        name: input.name,
        email: input.email,
        activities: input.activities,
      });
    } else {
      const now = new Date();
      qb.update("activities", input.activities)
        .update("name", input.name)
        .update("updated_at", now);
    }

    [qb] = await qb.returning("*").catch((err: Record<any, any>) => {
      /* @see https://eslint.org/docs/latest/rules/no-prototype-builtins */
      if (
        Object.prototype.hasOwnProperty.call(err, "constraint") &&
        !!err.constraint
      ) {
        throw new DbConflictError(CustomApiErrorMessages.EmailConflict);
      } else {
        throw new DbInsertError(err.message);
      }
    });

    if (!qb) {
      throw new DbInsertError("There was an error while upserting this friend");
    }

    return qb;
  });
