import { Translation } from "@types";

interface SelectProps {
  context: Express.RequestContext;
}

export const select = async ({
  context: { db, log },
}: SelectProps): Promise<Translation[]> => {
  log.info("Selecting all translations");

  const search = await db.select("*").from<Translation>("translations");

  return search;
};
