import { Button, Flex, Text } from "@theme-ui/components";
import Link from "next/link";
import Container from "../shared/components/Container";
import useWallet from "../wallet/hooks/useWallet";

export default function Home() {
  const { address } = useWallet();
  return (
    <Container>
      <Text
        mb={3}
        sx={{
          fontSize: 4,
          fontWeight: "bold",
        }}
        as="h1"
      >
        a very simple Ethereum wallet
      </Text>
      {address == null ? (
        <Link href="/connect" sx={{ display: "inline-block" }}>
          <Button>Connect</Button>
        </Link>
      ) : (
        <Link
          href={`/wallet?address=${address}`}
          sx={{ display: "inline-block" }}
        >
          <Button>Wallet →</Button>
        </Link>
      )}
    </Container>
  );
}
