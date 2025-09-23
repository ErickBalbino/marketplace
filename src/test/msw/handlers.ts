import { http, HttpResponse } from "msw";

export const handlers = [
  http.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products`, () =>
    HttpResponse.json([{ id: "1", title: "Camiseta", price: 59.9 }]),
  ),
];
