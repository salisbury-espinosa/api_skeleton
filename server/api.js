/* @flow */

import express, { type $Application } from "express";

import HttpServer, { type ConfigHttpServer } from "./middleware/HttpServer";
import Routes, { type ConfigRoutes } from "./middleware/Routes";

export type ConfigApi = ConfigHttpServer & ConfigRoutes;

export default class Api {
  static app: $Application = express();

  static _installedPlugins: Map<string, any> = new Map();

  static async init({
    controllers,
    serverPort,
    workers = 2
  }: ConfigApi): Promise<Object | Error> {
    Api.use(
      HttpServer,
      ({
        workers,
        serverPort
      }: ConfigHttpServer)
    );
    Api.use(
      Routes,
      ({
        controllers
      }: ConfigRoutes)
    );

    return Api;
  }

  static use(Plugin: any, ...args: any): any {
    if (Api._installedPlugins.has(Plugin)) {
      return this;
    }

    const plugin = typeof Plugin === "function" ? new Plugin(...args) : null;

    if (plugin) {
      Api._installedPlugins.set(Plugin, plugin);
    }

    return this;
  }
}
