export default class HttpError extends Error {
  constructor(readonly statusCode: number, readonly message: any) {
    super(message);
  }
}
