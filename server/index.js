import { PORT } from "~/config";
import Api, { type ConfigApi } from "./api";

import PingController from "./controllers/ping";
import TxController from "./controllers/tx";

const controllers = [
  {
    Ctrl: PingController
  },
  {
    Ctrl: TxController
  }
];

export default Api.init(
  ({
    controllers,
    serverPort: PORT
  }: ConfigApi)
);
