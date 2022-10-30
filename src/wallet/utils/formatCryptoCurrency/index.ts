import BigNumber from "bignumber.js";

interface Params {
  value: BigNumber.Value;
  symbol?: string;
  maximumDigits?: number;
  minimumDigits?: number;
}

const formatCryptoCurrency = ({
  value,
  symbol,
  maximumDigits = 18,
  minimumDigits = 0,
}: Params) => {
  const bn = new BigNumber(value);
  return `${bn.toFormat(
    Math.min(Math.max(bn.decimalPlaces() ?? 8, minimumDigits), maximumDigits)
  )} ${symbol?.toUpperCase() ?? ""}`;
};

export default formatCryptoCurrency;
