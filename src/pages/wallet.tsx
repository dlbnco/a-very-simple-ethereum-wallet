import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import qs from "qs";
import etherScanHandler from "../etherscan/handler";

import Container from "../shared/components/Container";

import Summary from "../wallet/components/Summary";

interface Props {
  balance: string;
}

const WalletPage = (props: Props) => {
  const router = useRouter();
  const address = router.query.address as string;

  if (address == null) return null;
  return (
    <Container>
      <Summary balance={props.balance} address={address} />
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
  const balance = await etherScanHandler({
    module: "account",
    action: "balance",
    address,
    tag: "latest",
  });
  return {
    props: {
      balance: balance.result,
    },
  };
};

export default WalletPage;
