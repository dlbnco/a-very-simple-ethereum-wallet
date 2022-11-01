import { GetServerSideProps } from "next";
import qs from "qs";
import alchemyHandler from "../../../alchemy/handler";

export interface WalletProps {
  balance: string;
  token?: {
    decimals: number;
    name: string;
    symbol: string;
    logo?: string;
  };
  tokenBalance?: {
    contractAddress: string;
    tokenBalance: string;
  };
}

const getBalanceServerSideProps: GetServerSideProps<WalletProps> = async ({
  req,
}) => {
  const { url } = req;
  if (url == null) {
    return {
      props: {
        balance: "0",
      },
    };
  }
  const { address, contract } = qs.parse(url.split("?")[1], {
    ignoreQueryPrefix: true,
  });
  const balance = await alchemyHandler({
    params: [address, "latest"],
    method: "eth_getBalance",
  });
  let token;
  let tokenBalance;
  if (contract != null) {
    tokenBalance = await alchemyHandler({
      method: "alchemy_getTokenBalances",
      params: [address, [contract]],
    });
    token = await alchemyHandler({
      method: "alchemy_getTokenMetadata",
      params: [contract],
    });
  }
  return {
    props: {
      balance: balance?.result ?? null,
      token: token?.result ?? null,
      tokenBalance: tokenBalance?.result?.tokenBalances?.[0] ?? null,
    },
  };
};

export default getBalanceServerSideProps;
