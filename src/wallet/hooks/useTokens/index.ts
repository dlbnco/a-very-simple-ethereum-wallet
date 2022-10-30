import { useLocalStorageValue } from "@react-hookz/web";
import { useCallback, useEffect, useState } from "react";
import useWallet from "../useWallet";

export interface Token {
  decimals?: number;
  logo?: string;
  name?: string;
  symbol?: string;
  address: string;
}

const useTokens = () => {
  const { address } = useWallet();
  const [tokens, setTokens] = useLocalStorageValue<Token[]>(
    `tokens-${address}`,
    []
  );

  const addToken = useCallback(
    (token: Token) => {
      const newArr = [...tokens, token].filter(
        // deduplicate
        (x, i, self) => i === self.findIndex((y) => y.address === x.address)
      );
      setTokens(newArr);
    },
    [tokens, setTokens]
  );

  const removeToken = useCallback(
    (address: string) => {
      const newArr = tokens.filter((token) => token.address !== address);
      setTokens(newArr);
    },
    [tokens, setTokens]
  );

  return {
    tokens,
    addToken,
    removeToken,
  };
};

export default useTokens;
