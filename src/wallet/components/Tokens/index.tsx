import BigNumber from "bignumber.js";
import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  Box,
  Label,
  Input,
  Button,
  Card,
  Flex,
  BoxProps,
} from "theme-ui";
import useTokens, { Token } from "../../hooks/useTokens";
import useWallet from "../../hooks/useWallet";
import formatCryptoCurrency from "../../utils/formatCryptoCurrency";

const AddToken: React.FC<BoxProps> = (props) => {
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { addToken } = useTokens();

  const onChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (error != null) setError(null);
      setInput(e.target.value);
    },
    [setInput, error]
  );

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsLoading(true);
      setError(null);
      try {
        const params = {
          method: "alchemy_getTokenMetadata",
          params: [input],
        };
        const result = await fetch(`/api/alchemy`, {
          method: "POST",
          body: JSON.stringify(params),
        });
        const json = await result.json();
        if (json.error != null) throw new Error(json.error.message);

        const token = json.result;
        addToken({ ...token, address: input });
        setInput("");
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    },
    [input, addToken, setInput]
  );

  const isButtonDisabled = input.length === 0 || isLoading;

  return (
    <Card as="form" onSubmit={onSubmit} my={4} {...props}>
      <Label sx={{ flexDirection: "column" }} mb={2}>
        <Text sx={{ mb: 1 }}>
          Follow a ERC-20 token by providing the contract address
        </Text>
        <Input onChange={onChangeInput} disabled={isLoading} value={input} />
      </Label>
      {error?.message != null && (
        <Text sx={{ display: "block" }} my={2}>
          {error.message}
        </Text>
      )}
      <Button
        type="submit"
        variant={isButtonDisabled ? "disabled" : undefined}
        disabled={isButtonDisabled}
      >
        Add
      </Button>
    </Card>
  );
};

const TokenItem: React.FC<
  Token & BoxProps & { balance?: string; onRemove: (address: string) => void }
> = ({
  name,
  symbol,
  address,
  decimals,
  logo,
  onRemove,
  balance,
  ...props
}) => {
    const removeToken = useCallback(() => {
      onRemove(address);
    }, [onRemove, address]);

    const bnBalance = balance
      ? new BigNumber(balance).div(`10e+${(decimals ?? 1) - 1}`)
      : undefined;
    return (
      <Card
        p={3}
        sx={{
          borderRadius: 4,
          borderColor: "tertiary",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
        {...props}
      >
        <Text sx={{ fontSize: 3 }}>
          {bnBalance
            ? formatCryptoCurrency({
              value: bnBalance,
              symbol: symbol,
            })
            : `…`}
        </Text>
        <Text sx={{ display: "block", mb: 1, fontSize: 0 }}>{name}</Text>
        <Text
          sx={{ display: "block", color: "secondary", mb: 1, fontSize: 0 }}
          variant="monospace"
        >
          {address}
        </Text>
        <Text
          role="button"
          onClick={removeToken}
          sx={{
            color: "secondary",
            mb: 1,
            fontSize: 0,
            cursor: "pointer",
            ":hover": {
              textDecoration: "underline",
            },
          }}
        >
          remove
        </Text>
      </Card>
    );
  };

interface TokenBalance {
  contractAddress: string;
  tokenBalance: string;
}

const Tokens: React.FC<BoxProps> = (props) => {
  const { address } = useWallet();
  const { tokens, removeToken } = useTokens();
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>();

  useEffect(() => {
    (async () => {
      try {
        const params = {
          method: "alchemy_getTokenBalances",
          params: [address, tokens.map((token) => token.address)],
        };
        const result = await fetch(`/api/alchemy`, {
          method: "POST",
          body: JSON.stringify(params),
        });
        const json = await result.json();
        setTokenBalances(json.result?.tokenBalances);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [tokens, address, setTokenBalances]);

  return (
    <Box {...props}>
      <AddToken mb={3} />
      <Flex sx={{ flexDirection: "column" }} my={-1}>
        {tokens?.map((token) => {
          const balance = tokenBalances?.find(
            (balance) => balance.contractAddress === token.address
          )?.tokenBalance;
          return (
            <TokenItem
              key={token.address}
              onRemove={removeToken}
              balance={balance}
              {...token}
              my={1}
            />
          );
        })}
      </Flex>
    </Box>
  );
};

export default Tokens;
