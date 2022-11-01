import BigNumber from "bignumber.js";

export const fromWei = (value: BigNumber.Value) => {
  return new BigNumber(value).div(new BigNumber(10).pow(18));
};

export const toWei = (value: BigNumber.Value) => {
  return new BigNumber(value).times(new BigNumber(10).pow(18));
};
