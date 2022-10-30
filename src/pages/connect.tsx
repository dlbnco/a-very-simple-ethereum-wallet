import { NextPage } from "next";
import Container from "../shared/components/Container";
import Connect from "../wallet/components/Connect";

const ConnectPage: NextPage = () => (
  <Container>
    <Connect />
  </Container>
);

export default ConnectPage;
