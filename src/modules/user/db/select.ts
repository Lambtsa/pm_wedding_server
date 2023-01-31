import { User } from "@types";

interface InsertProps {
  context: Express.RequestContext;
}

export const select = async ({
  context: { db, log },
}: InsertProps): Promise<User[]> => {
  log.info("Selecting all users");
  const search = await db
    .select("*")
    .from<User>("users")
    .orderBy("created_at", "desc")
    .limit(3);

  return search;
};
