// @flow
import type { Router } from "express";

export default class Controller {
  registerRoutes(router: Router): void {
    throw new Error("Using default method: 'registerRoutes'");
  }
}
