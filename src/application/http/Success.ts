import HttpSuccess from "./extends/HttpSuccess";

export default class Success extends HttpSuccess {
  constructor(readonly data?: any) {
    super(200, data);
  }
}
