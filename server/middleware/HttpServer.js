import cluster from "cluster";
import os from "os";

import { type $Application } from "express";

import logger from "../lib/logger";
import Api from "../api";

export type ConfigHttpServer = {
  serverPort?: number,
  workers?: number
};

export default class HttpServer {
  _serverPort: number;
  _workers: number;

  constructor({ serverPort = 5000, workers = 2 }: ConfigHttpServer): void {
    this._serverPort = serverPort;
    this._workers = workers;

    this._setupApi(Api.app);
  }

  _forkWorkers(): void {
    for (let i = 0; i < Math.min(os.cpus().length, this._workers); i += 1) {
      cluster.fork();
    }
  }

  _workersOnExit(): void {
    cluster.on("exit", worker => {
      logger.error(`Worker '${worker.process.pid}' died, spinning up another!`);
      cluster.fork();
    });
  }

  _setupApi(app: $Application): void {
    if (cluster.isMaster) {
      this._forkWorkers();
      this._workersOnExit();
      logger.info(`API started on port: ${this._serverPort}`);
    } else {
      app.listen(this._serverPort);
    }
  }
}
