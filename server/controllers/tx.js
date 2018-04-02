import type { $Response, $Request, Router, NextFunction } from "express";
import type { TxId, Tx } from "../flow-typed/bitcoin";
import BitcoinService from "../services/bitcoin";
import Controller from "./controller";
import { asyncUtilWrap } from "../lib/utils";

export default class TxController extends Controller {
  _service: BitcoinService;

  constructor(): void {
    super();
    this._service = new BitcoinService();
  }

  registerRoutes(router: Router): void {
    router.get("/tx/:txid", asyncUtilWrap(this.getTx.bind(this)));
  }

  async getTx(
    req: $Request,
    res: $Response,
    next: NextFunction
  ): Promise<$Response | Error> {
    const { txid }: { txid: TxId } = req.params;
    const data: ?Tx = await this._service.getTxByHash(txid);
    if (data) {
      return res.json(data);
    }
    throw new Error("not found transaction");
  }
}
