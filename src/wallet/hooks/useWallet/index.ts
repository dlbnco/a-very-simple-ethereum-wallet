import { useSessionStorageValue } from "@react-hookz/web";
import Wallet from "ethereumjs-wallet";
import { useEffect, useState } from "react";

const useWallet = () => {
  const [wallet, setWallet] = useState<Wallet>();
  const [privateKey] = useSessionStorageValue<string>("privateKey");
  useEffect(() => {
    /**
     * Our private key is stored locally, thus not accessible server-side.
     * We could return `wallet` directly but that would result in different renders between server and client.
     * Instead, we'll store `wallet` with `useState`, so the first render (where `wallet` is `undefined` are equal between server and client.
     * https://nextjs.org/docs/messages/react-hydration-error
     */
    if (typeof window === "undefined") return;
    if (privateKey == null) return;
    try {
      setWallet(Wallet.fromPrivateKey(Buffer.from(privateKey, "hex")));
    } catch (e) {
      console.error(e);
    }
  }, []);
  return {
    wallet,
    address: wallet?.getAddressString(),
  };
};

export default useWallet;
