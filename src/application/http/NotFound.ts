import HttpError from "./extends/HttpError";

export default class NotFound extends HttpError {
  constructor(readonly message: any) {
    super(404, message);
  }
}
