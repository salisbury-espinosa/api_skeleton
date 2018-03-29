/* @flow */
import { PORT } from "~/config";
import Api, { type ConfigApi } from "@/api";
import * as Controllers from "@/controllers";

export default Api.init(
  ({
    controllers: Object.keys(Controllers).map((ctrlName: string) => ({
      Ctrl: Controllers[ctrlName]
    })),
    serverPort: PORT
  }: ConfigApi)
);
