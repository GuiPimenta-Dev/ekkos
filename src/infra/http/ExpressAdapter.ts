import HttpError from "../../application/http/extends/HttpError";
import express from "express";

export default class ExpressAdapter {
  static create() {
    const app = express();
    app.use(express.json());
    return app;
  }

  static route(fn: any) {
    return async function (req: any, res: any) {
      try {
        const { query, body, headers, params, file } = req;
        const output: any = await fn({ query, body, headers, path: params, file });
        res.status(output.statusCode).json(output.data);
      } catch (e: any) {
        if (e instanceof HttpError) {
          return res.status(e.statusCode).json({ message: e.message });
        }
        res.status(422).json({ message: e.message });
      }
    };
  }
}
