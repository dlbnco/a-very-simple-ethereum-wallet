import { fromWei, toWei } from "./index";

describe("fromWei()", () => {
  it("converts correctly", () => {
    expect(fromWei(1000000000000000000).toNumber()).toBe(1);
  });
});

describe("toWei()", () => {
  it("converts correctly", () => {
    expect(toWei(1).toNumber()).toBe(1000000000000000000);
  });
});
