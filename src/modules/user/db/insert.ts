import { DbInsertError } from "@core/errors";
import { User } from "@types";
import { Knex } from "knex";
import { v4 as uuid } from "uuid";

interface InsertProps {
  context: Express.RequestContext;
  input: Pick<User, "name">;
}

export const insert = async ({
  context: { db, log },
  input,
}: InsertProps): Promise<User> =>
  await db.transaction(async (trx: Knex.Transaction) => {
    log.info("Inserting into Users table", { input });
    const search = await db<User>("users")
      .insert({
        id: uuid(),
        name: input.name,
      })
      .transacting(trx)
      .returning("*");

    if (!search[0]) {
      throw new DbInsertError("There was an error while adding the user");
    }

    return search[0];
  });
