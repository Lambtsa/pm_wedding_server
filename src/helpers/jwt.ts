import { AuthenticationError } from "@core/errors";
import { Secret, verify } from "jsonwebtoken";

/**
 * Decode JWT token for authenticated user
 * @param token
 * @returns string
 */
export const decodeToken = (token: string): string => {
  try {
    return verify(token, process.env.JWT_SECRET as Secret).toString();
  } catch (err) {
    throw new AuthenticationError();
  }
};
