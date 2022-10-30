import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import qs from "qs";
import alchemyHandler from "../../alchemy/handler";
import etherScanHandler from "../../etherscan/handler";

import Container from "../../shared/components/Container";
import Navigation from "../../wallet/components/Navigation";

import Summary from "../../wallet/components/Summary";
import Tokens from "../../wallet/components/Tokens";

interface Props {
  balance: string;
}

const WalletPage = (props: Props) => {
  const router = useRouter();
  const address = router.query.address as string;

  if (address == null) return null;
  return (
    <Container>
      <Summary balance={props.balance} address={address} mb={3} />
      <Navigation mb={4} />
      <Tokens />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
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
  const { address } = qs.parse(url.split("?")[1], {
    ignoreQueryPrefix: true,
  });
  const balance = await alchemyHandler({
    params: [address, "latest"],
    method: "eth_getBalance",
  });
  return {
    props: {
      balance: balance.result,
    },
  };
};

export default WalletPage;
