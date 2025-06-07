export class ResponseError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ResponseError';
    Error.captureStackTrace(this, this.constructor);
  }
}
