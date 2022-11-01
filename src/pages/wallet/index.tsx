import { NextPage } from "next";
import { useRouter } from "next/router";

import Container from "../../shared/components/Container";
import Navigation from "../../wallet/components/Navigation";

import Summary from "../../wallet/components/Summary";
import Tokens from "../../wallet/components/Tokens";
import getBalanceServerSideProps, {
  WalletProps,
} from "../../wallet/utils/getBalanceServerSideProps";

const WalletPage: NextPage<WalletProps> = (props) => {
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

export const getServerSideProps = getBalanceServerSideProps;

export default WalletPage;
