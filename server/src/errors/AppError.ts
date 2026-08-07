export class AppError extends Error {
  public status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "The requested resource was not found.") {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Invalid input.") {
    super(message, 400);
  }
}
