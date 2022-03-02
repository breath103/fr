import { Context, Event, Namespace, OpenAPIRoute, Router } from "@serverless-seoul/corgi";
import * as _ from "lodash";

import * as Entities from "./entities";
import { exceptionHandler } from "./exception_handler";
import { AuthenticationMiddleware } from "./middlewares/authentication";
import { DefaultResponseHeaderMiddleware } from "./middlewares/default_response_header";
import { routes } from "./routes";

export const router = new Router([
  new OpenAPIRoute(
    "/open-api",
    {
      title: "fr-api",
      version: "1.0.0",
      definitions: Entities,
    },
    routes,
  ),
  new Namespace("", {}, {
    children: routes,
    exceptionHandler,
  }),
], {
  middlewares: [
    new AuthenticationMiddleware(),
    new DefaultResponseHeaderMiddleware({
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    }),
  ],
});

export const __handler = router.handler();
export const handler = async (event: Event, context: Context) => {
  // Allow CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      body: "",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=86400",
        "Access-Control-Allow-Origin": _.mapKeys(event.headers, (__, k) => k.toLowerCase()).origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
        "Access-Control-Allow-Headers": [
          "Content-Type",
          "X-Catch-Auth-Token",
          "X-Catch-User-Agent",
        ].join(","),
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": `${60 * 60 * 24 * 30}`,
      },
    };
  } else {
    return await __handler(event, context);
  }
};
