// @flow
import bodyParser from "body-parser";
import compress from "compression";
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

    app.use(this._addSecHeaders);
    app.use(this._removeSecHeaders);

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

  /**
   * Add security sensitive headers.
   * @see https://github.com/shieldfy/API-Security-Checklist#output
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @param {!Function} next - The ExpressJS next function.
   * @returns {undefined}
   */
  _addSecHeaders(req: $Request, res: $Response, next: NextFunction): mixed {
    res.setHeader("X-Content-Type-Options", "no-sniff");
    res.setHeader("X-Frame-Options", "deny");
    res.setHeader("Content-Security-Policy", "default-src: 'none'");

    return next();
  }

  /**
   * Remove security sensitive headers.
   * @see https://github.com/shieldfy/API-Security-Checklist#output
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @param {!Function} next - The ExpressJS next function.
   * @returns {undefined}
   */
  _removeSecHeaders(req: $Request, res: $Response, next: NextFunction): mixed {
    res.removeHeader("X-Powered-By");
    res.removeHeader("Server");

    return next();
  }
}
