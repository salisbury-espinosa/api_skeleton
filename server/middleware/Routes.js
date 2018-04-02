import bodyParser from "body-parser";
import compress from "compression";
import helmet from "helmet";
import express, {
  type $Request,
  type $Response,
  type NextFunction
} from "express";
import responseTime from "response-time";

import { API_PREFIX } from "~/config";
import Api from "../api";

type ControllerListConfig = Array<{ Ctrl: Function, args?: Object }>;

export type ConfigRoutes = {
  controllers?: ControllerListConfig
};

export default class Routes {
  constructor({ controllers }: ConfigRoutes): void {
    this._setupExpress(controllers);
  }

  _setupExpress(controllers?: Array<Object>): void {
    const { app } = Api;
    app.use(
      helmet({
        frameguard: {
          action: "deny"
        },
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'none'"]
          }
        }
      })
    );
    app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
    app.use(bodyParser.json());
    app.use(
      compress({
        threshold: 1400,
        level: 4,
        memLevel: 3
      })
    );
    app.use(responseTime());

    if (controllers) {
      this._registerControllers(controllers);
    }
    app.use(this._setNotFoundHandler);
    app.use(this._setErrorHandler);
  }

  _registerControllers(controllers: ControllerListConfig): void {
    const { app } = Api;
    controllers.forEach(c => {
      const { Ctrl, args } = c;
      const controller = new Ctrl(args);

      const router = express.Router();
      controller.registerRoutes(router);

      app.use(API_PREFIX, router);
    });
  }

  _setNotFoundHandler(
    req: $Request,
    res: $Response,
    next: NextFunction
  ): mixed {
    res.status(404).json({ error: "Not found" });
  }

  _setErrorHandler(
    err: Error,
    req: $Request,
    res: $Response,
    next: NextFunction
  ): Object {
    const body: {
      [key: string]: string
    } = {
      message: err.message
    };

    if (process.env.NODE_ENV === "development") {
      body.stack = err.stack;
    }

    return res.status(500).json(body);
  }
}
