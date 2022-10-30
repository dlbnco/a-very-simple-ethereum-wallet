import BigNumber from "bignumber.js";

interface Params {
  value: BigNumber.Value;
  symbol: string;
}

const formatCryptoCurrency = ({ value, symbol }: Params) => {
  const bn = new BigNumber(value);
  return `${bn.toFormat(
    Math.min(Math.max(bn.decimalPlaces() ?? 8, 0), 18)
  )} ${symbol.toUpperCase()}`;
};

export default formatCryptoCurrency;
