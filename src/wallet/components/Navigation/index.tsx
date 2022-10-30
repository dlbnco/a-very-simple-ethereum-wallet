import Link from "next/link";
import { useRouter } from "next/router";
import qs from "qs";
import React from "react";
import { Button, Flex, FlexProps } from "theme-ui";

const Navigation: React.FC<FlexProps> = (props) => {
  const router = useRouter();
  const query = qs.stringify(router.query);
  return (
    <Flex {...props} mx={-1}>
      <Link href={`/wallet/send?${query}`} sx={{ mx: 1 }}>
        <Button>Send</Button>
      </Link>
      <Link href={`/wallet/history?${query}`} sx={{ mx: 1 }}>
        <Button variant="secondary">Transaction history</Button>
      </Link>
    </Flex>
  );
};

export default Navigation;
