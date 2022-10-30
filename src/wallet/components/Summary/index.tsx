import BigNumber from "bignumber.js";
import React from "react";
import formatCryptoCurrency from "../../utils/formatCryptoCurrency";
import fromWei from "../../utils/fromWei";
import { Text } from "theme-ui";

interface Props {
  balance: BigNumber.Value;
  address: string;
}

const Summary: React.FC<Props> = ({ balance, address }) => {
  return (
    <>
      <Text sx={{ fontSize: 6 }} mb={3}>
        {formatCryptoCurrency({ value: fromWei(balance), symbol: "eth" })}
      </Text>
      <Text
        as="p"
        variant="secondary"
        sx={{ fontSize: 2, display: "inline" }}
        ml={1}
      >
        {address}
      </Text>
    </>
  );
};

export default Summary;
