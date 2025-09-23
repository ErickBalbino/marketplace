import "@testing-library/jest-dom";
import { server } from "./msw/server";
import { afterAll, afterEach, beforeAll } from "vitest";
import { configure } from "@testing-library/react";

configure({ asyncUtilTimeout: 3000 });

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
