import HttpSuccess from "./extends/HttpSuccess";

export default class Created extends HttpSuccess {
  constructor(readonly data?: any) {
    super(201, data);
  }
}
