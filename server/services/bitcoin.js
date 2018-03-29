// @flow
import type { TxId, Tx } from "@/flow-typed/bitcoin";
import txList from "../data/bitcoin_tx_list";

export default class BitcoinService {
  async getTxByHash(txIdSearch: TxId): Promise<?Tx> {
    return txList.find(({ txid }: { txid: TxId }) => txid === txIdSearch);
  }
}
