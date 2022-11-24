export default class Success {
  statusCode: number;
  constructor(readonly data?: any) {
    this.statusCode = 200;
  }
}
