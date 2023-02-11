import { CustomZodError } from "@core/errors";
import { z } from "zod";

/**
 * Small helper function to remove whitespace and trim
 * @example sanitiseData("LaSt    Train    ") // "LaSt Train"
 */
export const sanitiseData = (input: string | undefined): string => {
  const rmWhitespaceRegex = /\s\s+/g;
  if (!input) {
    return "";
  }
  return input.trim().replace(rmWhitespaceRegex, " ");
};

/**
 * Will check against schema passed in as second argument
 * @returns input if valid and throws error if the data isn't valid
 */
export const validateData = <T extends string | number | Record<string, any>>(
  input: T,
  schema: z.ZodSchema<T>,
): T => {
  const isValid = schema.safeParse(input);
  if (!isValid.success) {
    throw new CustomZodError(isValid.error);
  }
  return input as T;
};
