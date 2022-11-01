import { Chain, Common, Hardfork } from "@ethereumjs/common";
import { Transaction, TxData } from "@ethereumjs/tx";

const buildTx = (privateKey: string, params: TxData) => {
  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.Merge,
  });
  const tx = Transaction.fromTxData(params, {
    common,
  });
  const signedTx = tx.sign(Buffer.from(privateKey, "hex"));
  return signedTx.serialize();
};

export default buildTx;
