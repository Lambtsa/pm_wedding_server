import { User } from "@types";
import { Knex } from "knex";

interface InsertProps {
  db: Knex<any, unknown[]>;
}

export const select = async ({ db }: InsertProps): Promise<User[]> => {
  const search = await db
    .select("*")
    .from<User>("users")
    .orderBy("created_at", "desc")
    .limit(3);

  return search;
};
