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
 * Will remove whitespace from data and check against schema passed in as second argument
 * @returns sanitised data and throws error if the data isn't valid
 */
export const validateData = <T extends Record<string, string>>(
  input: T,
  schema: z.ZodSchema<T>,
): T => {
  const newInput: T = input;
  for (const key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      newInput[key] = sanitiseData(input[key] as string) as T[Extract<
        keyof T,
        string
      >];
    }
  }

  const isValid = schema.safeParse(newInput);
  if (!isValid.success) {
    throw new CustomZodError(isValid.error);
  }
  return newInput as T;
};
