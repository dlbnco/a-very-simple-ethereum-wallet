import BigNumber from "bignumber.js";

const fromWei = (value: BigNumber.Value) => {
  return new BigNumber(value).div("10e+17");
};

export default fromWei;
