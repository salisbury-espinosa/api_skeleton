
export type TxId = string;
export type Hash = string;
export type Size = number;
export type Vsize = number;
export type Version = number;
export type Locktime = number;
export type Confirmations = number;
export type TxIn = Array<Object>;
export type TxOut = Array<Object>;
export type Tx = {
  txid: TxId,
  hash: Hash,
  size: Size,
  vsize: Vsize,
  version: Version,
  locktime: Locktime,
  confirmations: Confirmations,
  vin: TxIn,
  vout: TxOut
};
