import { Friend } from "@types";

interface InsertProps {
  context: Express.RequestContext;
}

export const select = async ({
  context: { db, log },
}: InsertProps): Promise<Friend[]> => {
  log.info("Selecting all friends");
  const search = await db
    .select("*")
    .from<Friend>("friends")
    .orderBy("created_at", "desc")
    .limit(3);

  return search;
};
