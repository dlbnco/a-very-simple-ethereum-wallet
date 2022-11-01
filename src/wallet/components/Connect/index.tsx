import { useSessionStorageValue } from "@react-hookz/web";
import { Box, Button, Input, Label, Text } from "@theme-ui/components";
import Wallet from "ethereumjs-wallet";
import { useRouter } from "next/router";
import React, { FormEvent, useCallback, useState } from "react";

const Connect: React.FC = () => {
  const router = useRouter();
  const [input, setInput] = useState<string>("");
  const [, setSessionPrivateKey] = useSessionStorageValue<string>(
    "privateKey",
    ""
  );
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (error != null) setError(null);
      setInput(e.target.value);
    },
    [setInput, error]
  );

  const onSubmit = useCallback(
    (e: FormEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        /**
         * Tries to initialize the wallet before proceeding;
         * Throws if there's something wrong with the private key.
         */
        const wallet = Wallet.fromPrivateKey(Buffer.from(input, "hex"));
        setSessionPrivateKey(input);
        router.push(`/wallet?address=${wallet.getAddressString()}`);
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    },
    [router, input, setSessionPrivateKey, setIsLoading]
  );

  return (
    <Box>
      <Box as="form" onSubmit={onSubmit}>
        <Label sx={{ flexDirection: "column" }} mb={2}>
          <Text mb={1} sx={{ display: "block" }}>
            Private key
          </Text>
          <Input
            value={input}
            onChange={onChangeInput}
            sx={{ display: "block" }}
            data-testid="privateKey-input"
            required
          />
        </Label>
        {error?.message != null && (
          <Text sx={{ display: "block" }} my={2} data-testid="error-message">
            {error.message}
          </Text>
        )}
        <Button mb={3} type="submit" data-testid="submit-button">
          Connect
        </Button>
      </Box>
      <Text variant="secondary" sx={{ display: "block", fontSize: 0 }}>
        Your data will be stored in your device only
      </Text>
    </Box>
  );
};

export default Connect;
