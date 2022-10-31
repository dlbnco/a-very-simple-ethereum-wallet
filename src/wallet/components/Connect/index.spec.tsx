import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Connect from "./index";

const VALID_PRIVATE_KEY =
  "efca4cdd31923b50f4214af5d2ae10e7ac45a5019e9431cc195482d707485378";

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("<Connect />", () => {
  beforeEach(() => {
    render(<Connect />);
    window.sessionStorage.clear();
  });
  it("Errors when using an invalid private key", async () => {
    const input = await screen.findByTestId("privateKey-input");
    await userEvent.type(input, "some random text");
    const submit = await screen.findByTestId("submit-button");
    await userEvent.click(submit);
    expect(screen.getByTestId("error-message").innerHTML).toEqual(
      "Expected private key to be an Uint8Array with length 32"
    );
  });
  it("Does not error when using a valid private key", async () => {
    const input = await screen.findByTestId("privateKey-input");
    await userEvent.type(input, VALID_PRIVATE_KEY);
    const submit = await screen.findByTestId("submit-button");
    await userEvent.click(submit);
    expect(screen.queryByTestId("error-message")).toBe(null);
  });
  it("Stores the valid private key in session storage", async () => {
    const input = await screen.findByTestId("privateKey-input");
    await userEvent.type(input, VALID_PRIVATE_KEY);
    const submit = await screen.findByTestId("submit-button");
    await userEvent.click(submit);
    expect(JSON.parse(sessionStorage.getItem("privateKey") ?? "")).toEqual(
      VALID_PRIVATE_KEY
    );
  });
});
