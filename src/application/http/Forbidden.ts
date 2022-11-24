import HttpError from "./extends/HttpError";

export default class Forbidden extends HttpError {
  constructor(readonly message: any) {
    super(403, message);
  }
}
