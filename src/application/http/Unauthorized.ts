import HttpError from "./extends/HttpError";

export default class Unauthorized extends HttpError {
  statusCode: number;
  constructor(readonly message: any) {
    super(401, message);
  }
}
