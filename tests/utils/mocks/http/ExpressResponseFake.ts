export default class ExpressResponseFake {
  statusCode: number;
  message: string;

  status(status: number) {
    this.statusCode = status;
    return this;
  }

  json({ message }: { message: string }) {
    this.message = message;
    return this;
  }
}
