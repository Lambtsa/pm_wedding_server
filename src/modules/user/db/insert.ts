import { DbInsertError } from "@core/errors";
import { User } from "@types";
import { Knex } from "knex";
import { v4 as uuid } from "uuid";

interface InsertProps {
  db: Knex<any, unknown[]>;
  input: Pick<User, "name">;
  trx: Knex.Transaction;
}

export const insert = async ({
  db,
  input,
  trx,
}: InsertProps): Promise<User> => {
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
};
