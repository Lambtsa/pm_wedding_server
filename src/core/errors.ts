import { ZodError, ZodSchema } from "zod";

export enum CustomApiErrorMessages {
  NoAccessToken = "No access token",
  IncorrectInput = "Input data is incorrect or incomplete",
  NotFound = "Endpoint doesn't exist",
  IncorrectMethod = "Only POST method is available",
  TooManyRequests = "You sent too many requests. Please wait a while then try again",
  NewsDescriptionConflict = "Cannot have the same title and description",
  TranslationConflict = "Cannot have the same title, description and language",
  EmailConflict = "Email already exists",
  NoAuthentication = "You are not authorised to make this request",
}

export class CustomBaseError extends Error {
  statusCode = 500;

  constructor(message?: string) {
    super(message);

    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, CustomBaseError.prototype);
  }
}

export class DbConnectionError extends Error {
  statusCode = 503;

  constructor(message?: string) {
    super(message);

    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, DbConnectionError.prototype);
  }
}

export class DbInsertError extends Error {
  statusCode = 500;

  constructor(message?: string) {
    super(message);

    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, DbInsertError.prototype);
  }
}

export class BadGatewayError extends CustomBaseError {
  statusCode = 502;
  message = CustomApiErrorMessages.NoAccessToken;

  constructor(message?: string) {
    super(message);

    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, BadGatewayError.prototype);
  }
}

export class BadRequestError extends CustomBaseError {
  statusCode = 400;
  message = CustomApiErrorMessages.IncorrectInput;

  constructor(message?: string) {
    super(message);

    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class CustomZodError<T extends ZodSchema> extends CustomBaseError {
  statusCode = 400;
  error: ZodError;

  constructor(error: ZodError<T>) {
    super();
    this.error = error;

    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, CustomZodError.prototype);
  }

  get errors() {
    return this.error.issues.flatMap((issue) => {
      return issue.path.map((field) => ({
        type: issue.message,
        field,
      }));
    });
  }
}

export class DbConflictError extends CustomBaseError {
  statusCode = 400;
  message: string;

  constructor(message: string) {
    super(message);

    this.message = message;

    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, DbConflictError.prototype);
  }
}

export class AuthenticationError extends CustomBaseError {
  statusCode = 401;
  message = CustomApiErrorMessages.NoAuthentication;

  constructor(message?: string) {
    super(message);

    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class NotFoundError extends CustomBaseError {
  statusCode = 404;
  message = CustomApiErrorMessages.NotFound;

  constructor(message?: string) {
    super(message);

    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class MethodNotAllowedError extends CustomBaseError {
  statusCode = 405;
  message = CustomApiErrorMessages.IncorrectMethod;

  constructor(message?: string) {
    super(message);

    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, MethodNotAllowedError.prototype);
  }
}

export class TooManyRequestsError extends CustomBaseError {
  statusCode = 429;
  message = CustomApiErrorMessages.TooManyRequests;

  constructor(message?: string) {
    super(message);

    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, TooManyRequestsError.prototype);
  }
}
