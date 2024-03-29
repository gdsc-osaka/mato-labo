import {expect, test, vitest} from "vitest";
import Home from "@/app/page";
import {render, screen} from "@testing-library/react";

vitest.mock('next/navigation', () => ({
  useRouter() {
    return {
      asPath: '/',
    };
  },
}));

test("Home Test", () => {
  render(<Home/>);
  expect(
    screen.getByText("検索")
  ).toBeDefined()
});
