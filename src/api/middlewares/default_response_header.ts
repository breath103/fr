import { Middleware, MiddlewareAfterOptions, MiddlewareBeforeOptions, Response } from "@serverless-seoul/corgi";

import * as _ from "lodash";
import * as moment from "moment";

export class DefaultResponseHeaderMiddleware implements Middleware {
  public requestStartTime: Date | undefined = undefined;

  constructor(private config: { [name: string]: string | ((res: Response) => Promise<string>) }) {}

  public async before(__: MiddlewareBeforeOptions<undefined>) {
    this.requestStartTime = new Date();
  }

  public async after(options: MiddlewareAfterOptions<undefined>) {
    const { response } = options;
    response.headers ??= {};

    await Promise.all(
      _.map(this.config, async (v, name) => {
        if (!response.headers![name]) {
          if (typeof v === "string") {
            response.headers![name] = v;
          } else {
            response.headers![name] = await v(response);
          }
        }
      }));

    // Handling CORS
    const reqOrigin = options.routingContext.headers.origin as string | undefined;
    Object.assign(
      response.headers, {
        "Access-Control-Allow-Origin": reqOrigin,
        "Access-Control-Allow-Methods": [
          "GET", "POST", "OPTIONS", "PUT", "DELETE",
        ].join(","),
        "Access-Control-Allow-Headers": [
          "Content-Type",
          "X-Catch-Auth-Token",
        ].join(","),
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": moment.duration(30, "days").asSeconds().toString(),
      },
    );

    return response;
  }
}
