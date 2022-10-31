import fromWei from "./index";

describe("fromWei()", () => {
  it("converts correctly", () => {
    expect(fromWei(1029830198203981).toNumber()).toBe(0.001029830198203981);
  });
});
