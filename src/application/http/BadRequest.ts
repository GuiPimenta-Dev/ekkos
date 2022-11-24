import HttpError from "./extends/HttpError";

export default class BadRequest extends HttpError {
  constructor(readonly message: any) {
    super(400, message);
  }
}
