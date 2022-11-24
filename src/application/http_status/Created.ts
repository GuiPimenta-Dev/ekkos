export default class Created {
  statusCode: number;
  constructor(readonly data?: any) {
    this.statusCode = 201;
  }
}
