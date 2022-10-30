import BigNumber from "bignumber.js";
import React from "react";
import formatCryptoCurrency from "../../utils/formatCryptoCurrency";
import fromWei from "../../utils/fromWei";
import { Box, BoxProps, Text } from "theme-ui";

interface Props {
  balance: BigNumber.Value;
  address: string;
}

const Summary: React.FC<Props & BoxProps> = ({
  balance,
  address,
  ...props
}) => {
  return (
    <Box {...props}>
      <Text sx={{ fontSize: 6 }} mb={3}>
        {formatCryptoCurrency({ value: fromWei(balance), symbol: "eth" })}
      </Text>
      <Text
        as="p"
        variant="monospace"
        sx={{ fontSize: 2, color: "secondary" }}
        ml={1}
      >
        {address}
      </Text>
    </Box>
  );
};

export default Summary;
