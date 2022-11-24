import express from "express";
import HttpError from "../../application/http_status/extends/HttpError";

export default class ExpressAdapter {
  static create() {
    const app = express();
    app.use(express.json());
    return app;
  }

  static route(...fns: any[]) {
    return async function (req: any, res: any) {
      try {
        const { query, body, headers, params } = req;
        let output: any;
        for (let fn of fns) {
          output = await fn({ query, body, headers, path: params });
        }
        res.status(output.statusCode).json(output.data);
      } catch (e: any) {
        if (e instanceof HttpError) {
          return res.status(e.statusCode || 500).json({ message: e.message });
        }
        res.status(422).json({ message: e.message });
      }
    };
  }
}
