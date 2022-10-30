import Link from "next/link";
import { useRouter } from "next/router";
import qs from "qs";
import React from "react";
import { SxProp, Text } from "theme-ui";

const BackButton: React.FC<SxProp> = (props) => {
  const router = useRouter();
  const query = qs.stringify({ address: router.query.address });
  return (
    <Link
      href={`/wallet?${query}`}
      sx={{ fontSize: 4, textDecoration: "none" }}
      {...props}
    >
      <Text>← back</Text>
    </Link>
  );
};

export default BackButton;
