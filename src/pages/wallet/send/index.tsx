import BigNumber from "bignumber.js";
import { NextPage } from "next";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Text, Input, Label, Button } from "theme-ui";
import Container from "../../../shared/components/Container";
import BackButton from "../../../wallet/components/BackButton";
import useWallet from "../../../wallet/hooks/useWallet";
import buildTx from "../../../wallet/utils/buildTx";
import formatCryptoCurrency from "../../../wallet/utils/formatCryptoCurrency";
import { fromWei, toWei } from "../../../wallet/utils/units";
import getBalanceServerSideProps, {
  WalletProps,
} from "../../../wallet/utils/getBalanceServerSideProps";
import { isValidAddress } from "@ethereumjs/util";
import erc20 from "../../../wallet/constants/erc20";

enum FormFields {
  amount = "amount",
  to = "to",
  gasPrice = "gasPrice",
  gasLimit = "gasLimit",
}

const initialState = (token: boolean) => ({
  [FormFields.amount]: "0",
  [FormFields.to]: "",
  [FormFields.gasPrice]: "",
  [FormFields.gasLimit]: token ? "100000" : "21000",
});

const SendPage: NextPage<WalletProps> = ({ balance, token, tokenBalance }) => {
  const { address, privateKey } = useWallet();
  const [input, setInput] = useState<Partial<Record<FormFields, string>>>(
    initialState(!!token)
  );
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [hash, setHash] = useState<string>();

  const onInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const name = e.target.name;
      if (error != null) setError(null);
      if (success) setSuccess(false);
      if (hash) setHash(undefined);
      setInput({
        ...input,
        [name]: e.target.value,
      });
    },
    [setInput, input, error, setError, success, setSuccess, hash, setHash]
  );

  /**
   * On load, fetch the current gas price.
   */
  useEffect(() => {
    (async () => {
      const result = await fetch(`/api/alchemy`, {
        method: "POST",
        body: JSON.stringify({
          method: "eth_gasPrice",
        }),
      });
      const gasPrice = await result.json();
      setInput({
        ...input,
        [FormFields.gasPrice]: parseInt(gasPrice.result, 16).toString(),
      });
    })();
  }, []);

  const contractAddress = tokenBalance?.contractAddress;
  const ethBalance = fromWei(balance);
  const erc20Balance = token
    ? new BigNumber(tokenBalance?.tokenBalance ?? 0).div(
      `10e+${(token.decimals ?? 1) - 1}`
    )
    : undefined;

  const to = input[FormFields.to];
  const amount = input[FormFields.amount];
  const gasPrice = input[FormFields.gasPrice];
  const gasLimit = input[FormFields.gasLimit];

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      if (error != null) setError(null);
      if (success) setSuccess(false);
      if (hash) setHash(undefined);
      try {
        // Fetch the address nonce.
        const nonceResult = await fetch(`/api/alchemy`, {
          method: "POST",
          body: JSON.stringify({
            method: "eth_getTransactionCount",
            params: [address, "latest"],
          }),
        });
        const nonce = await nonceResult.json();
        if (privateKey == null) throw new Error("privateKey must be defined");
        let tx: Buffer;
        if (token != null) {
          // In case we're sending a ERC20 token, load the contract.
          const Contract = require("web3-eth-contract");
          const contract = new Contract(JSON.parse(erc20), contractAddress, {
            from: address,
          });
          tx = buildTx(privateKey.slice(2), {
            nonce: nonce.result,
            to: contractAddress,
            value: `0x0`,
            gasPrice: `0x${new BigNumber(gasPrice ?? 0).toString(16)}`,
            gasLimit: `0x${new BigNumber(gasLimit ?? 0).toString(16)}`,
            data: contract.methods
              .transfer(
                to,
                new BigNumber(amount ?? 0)
                  .times(`10e+${token.decimals - 1}`)
                  .toNumber()
              )
              .encodeABI(),
          });
        } else {
          // Otherwise, do a regular Ether transaction.
          tx = buildTx(privateKey.slice(2), {
            nonce: nonce.result,
            to: to,
            value: `0x${toWei(amount ?? 0).toString(16)}`,
            gasPrice: `0x${new BigNumber(gasPrice ?? 0).toString(16)}`,
            gasLimit: `0x${new BigNumber(gasLimit ?? 0).toString(16)}`,
          });
        }
        const result = await fetch(`/api/alchemy`, {
          method: "POST",
          body: JSON.stringify({
            method: "eth_sendRawTransaction",
            params: [`0x${tx.toString("hex")}`],
          }),
        });
        const transaction = await result.json();
        if (transaction.error != null)
          throw new Error(transaction.error.message);
        setSuccess(true);
        setHash(transaction.result);
      } catch (e: any) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    },
    [
      address,
      privateKey,
      error,
      setError,
      setIsLoading,
      success,
      setSuccess,
      to,
      amount,
      gasPrice,
      gasLimit,
      token,
      contractAddress,
      hash,
      setHash,
    ]
  );

  const fee = useMemo(() => {
    return fromWei(new BigNumber(gasPrice ?? 0).times(gasLimit ?? 0));
  }, [gasPrice, gasLimit]);

  const hasEnoughBalance = useMemo(() => {
    if (token) {
      return erc20Balance?.gte(amount ?? 0) && ethBalance.gte(fee);
    }
    return ethBalance.gte(new BigNumber(amount ?? 0).plus(fee));
  }, [amount, fee, ethBalance, erc20Balance, token]);

  const canSubmit =
    hasEnoughBalance &&
    isValidAddress(input[FormFields.to] ?? "") &&
    !isLoading;

  return (
    <Container>
      <BackButton sx={{ mb: 3 }} />
      <Text mb={3}>
        Balance:{" "}
        {formatCryptoCurrency({
          value: token ? erc20Balance ?? 0 : ethBalance,
          symbol: token ? token.symbol : "ETH",
        })}
      </Text>
      {token && (
        <Text mb={3}>
          ETH balance:{" "}
          {formatCryptoCurrency({
            value: ethBalance,
            symbol: "ETH",
          })}
        </Text>
      )}
      <form onSubmit={onSubmit} sx={{ minWidth: [320, 480] }}>
        <Label sx={{ flexDirection: "column" }} mb={3}>
          <Text sx={{ mb: 1 }}>Amount</Text>
          <Input
            name={FormFields.amount}
            type="number"
            value={input[FormFields.amount]}
            onChange={onInputChange}
          />
        </Label>
        <Label sx={{ flexDirection: "column" }} mb={3}>
          <Text sx={{ mb: 1 }}>Address</Text>
          <Input
            name={FormFields.to}
            value={input[FormFields.to]}
            onChange={onInputChange}
          />
        </Label>
        <Label sx={{ flexDirection: "column" }} mb={3}>
          <Text sx={{ mb: 1 }}>Gas price (in wei)</Text>
          <Input
            name={FormFields.gasPrice}
            type="number"
            value={input[FormFields.gasPrice]}
            onChange={onInputChange}
          />
        </Label>
        <Label sx={{ flexDirection: "column" }} mb={3}>
          <Text sx={{ mb: 1 }}>Gas limit</Text>
          <Input
            name={FormFields.gasLimit}
            type="number"
            value={input[FormFields.gasLimit]}
            onChange={onInputChange}
          />
        </Label>
        <Text sx={{ display: "block" }} mb={3}>
          Estimated fee:
          <br />
          {formatCryptoCurrency({ value: fee, symbol: "eth" })}
        </Text>
        {error?.message != null && (
          <Text sx={{ display: "block" }} my={3}>
            {error.message}
          </Text>
        )}
        <Button
          variant={canSubmit ? undefined : "disabled"}
          disabled={!canSubmit}
          type="submit"
        >
          Submit
        </Button>
      </form>
      {success && (
        <Text sx={{ display: "block", fontWeight: "bold" }} my={3}>
          Transaction sent 🎈
        </Text>
      )}
      {hash && (
        <Text variant="monospace" sx={{ display: "block", color: "secondary" }}>
          {hash}
        </Text>
      )}
    </Container>
  );
};

export const getServerSideProps = getBalanceServerSideProps;

export default SendPage;
