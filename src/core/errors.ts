export enum CustomApiErrorMessages {
  NoAccessToken = "No access token",
  IncorrectInput = "Input data is incorrect or incomplete",
  NotFound = "Endpoint doesn't exist",
  IncorrectMethod = "Only POST method is available",
  TooManyRequests = "You sent too many requests. Please wait a while then try again",
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
