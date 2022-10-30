import { useSessionStorageValue } from "@react-hookz/web";
import { Box, Button, Input, Label, Text } from "@theme-ui/components";
import Wallet from "ethereumjs-wallet";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";

const Connect: React.FC = () => {
  const router = useRouter();
  const [input, setInput] = useState<string>("");
  const [sessionPrivateKey, setSessionPrivateKey] =
    useSessionStorageValue<string>("privateKey", "");
  const [error, setError] = useState<any>(null);

  const onChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (error != null) setError(null);
      setInput(e.target.value);
    },
    [setSessionPrivateKey, error]
  );

  const onClick = useCallback(() => {
    try {
      /**
       * Tries to initialize the wallet before proceeding;
       * Throws if there's something wrong with the private key.
       */
      const wallet = Wallet.fromPrivateKey(Buffer.from(input, "hex"));
      setSessionPrivateKey(input);
      router.push(`/wallet?address=${wallet.getAddressString()}`);
    } catch (e) {
      console.error(e);
      setError(e);
    }
  }, [sessionPrivateKey, router]);

  return (
    <Box>
      <Label sx={{ flexDirection: "column" }} mb={2}>
        <Text mb={1} sx={{ display: "block" }}>
          Private key
        </Text>
        <Input
          value={input}
          onChange={onChangeInput}
          sx={{ display: "block" }}
        />
      </Label>
      {error?.message != null && (
        <Text sx={{ display: "block" }} my={2}>
          {error.message}
        </Text>
      )}
      <Button mb={3} onClick={onClick}>
        Connect
      </Button>
      <Text variant="secondary" sx={{ display: "block", fontSize: 0 }}>
        Your data will be stored in your device only
      </Text>
    </Box>
  );
};

export default Connect;
