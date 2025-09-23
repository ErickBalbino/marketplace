import { render, screen } from "@testing-library/react";

function Hello() {
  return <h1>Marketplace</h1>;
}

test("smoke renders", () => {
  render(<Hello />);
  expect(
    screen.getByRole("heading", { name: /marketplace/i }),
  ).toBeInTheDocument();
});
