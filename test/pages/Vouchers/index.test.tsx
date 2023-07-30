import { render } from "@testing-library/react";
import Voucher from "../../../src/pages/Vouchers/index";

jest.mock("next/router", () => ({
  replace: jest.fn(),
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

test("renders Providers component", async () => {
  const { container } = render(<Voucher />);
  expect(container).toMatchSnapshot();
});
