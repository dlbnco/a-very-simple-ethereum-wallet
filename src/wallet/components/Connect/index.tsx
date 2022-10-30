import { Box, Button, Input, Label, Text } from "@theme-ui/components";
import Wallet from "ethereumjs-wallet";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";

const Connect: React.FC = () => {
  const router = useRouter();
  const [privateKey, setPrivateKey] = useState<string>("");
  const [error, setError] = useState<any>(null);

  const onChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (error != null) setError(null);
      setPrivateKey(e.target.value);
    },
    [setPrivateKey, error]
  );

  const onClick = useCallback(() => {
    try {
      /**
       * Tries to initialize the wallet before proceeding;
       * Throws if there's something wrong with the private key.
       */
      const wallet = Wallet.fromPrivateKey(Buffer.from(privateKey, "hex"));
      sessionStorage.setItem("privateKey", privateKey);
      router.push(`/wallet?address=${wallet.getAddressString()}`);
    } catch (e) {
      console.error(e);
      setError(e);
    }
  }, [privateKey, router]);

  return (
    <Box>
      <Label sx={{ flexDirection: "column" }} mb={2}>
        <Text mb={1} sx={{ display: "block" }}>
          Private key
        </Text>
        <Input
          value={privateKey}
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
