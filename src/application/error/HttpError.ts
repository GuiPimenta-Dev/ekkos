export default class HttpError {
  constructor(readonly statusCode: number, readonly message?: any) {}
}
