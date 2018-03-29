// @flow
import type { $Response, $Request, Router, NextFunction } from "express";
import Controller from "./controller";

export default class PingController extends Controller {
  registerRoutes(router: Router): void {
    router.get("/ping/:name", this.getPong.bind(this));
  }

  getPong(req: $Request, res: $Response, next: NextFunction): $Response {
    const { name } = req.params;
    return res.json({
      message: `Pong, ${name}`
    });
  }
}
