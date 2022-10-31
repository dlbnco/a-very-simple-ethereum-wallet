import BigNumber from "bignumber.js";
import formatCryptoCurrency from "./index";

describe("formatCryptoCurrency()", () => {
  describe("formats correctly", () => {
    test("round value", () => {
      expect(
        formatCryptoCurrency({
          value: new BigNumber(1),
          symbol: "BTC",
        })
      ).toBe("1 BTC");
    });
    test("round decimal value", () => {
      expect(
        formatCryptoCurrency({
          value: new BigNumber(0.1),
          symbol: "BTC",
        })
      ).toBe("0.1 BTC");
    });
    test("decimal value with high precision", () => {
      expect(
        formatCryptoCurrency({
          value: new BigNumber(0.12345678),
          symbol: "BTC",
        })
      ).toBe("0.12345678 BTC");
    });
    test("decimal value with minimum digits", () => {
      expect(
        formatCryptoCurrency({
          value: new BigNumber(0.1),
          symbol: "BTC",
          minimumDigits: 2,
        })
      ).toBe("0.10 BTC");
    });
    test("decimal value with maximum digits", () => {
      expect(
        formatCryptoCurrency({
          value: new BigNumber(0.123456),
          symbol: "BTC",
          maximumDigits: 2,
        })
      ).toBe("0.12 BTC");
    });
  });
});
