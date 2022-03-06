import { Namespace, Parameter, PresenterRouteFactory, StandardError } from "@serverless-seoul/corgi";
import { Type } from "@serverless-seoul/typebox";

// Models
import * as Models from "../../models";
import { routeMetadata } from "../helper";

// Presenters
import * as Presenters from "../presenters";

export const route = new Namespace(
  "/sessions", {}, {
    children: [
      PresenterRouteFactory.POST(
        "", {
          desc: "create new session",
          operationId: "createSession",
          metadata: routeMetadata({ access: "guest" }),
        }, {
          auth: Parameter.Body(Type.Object({
            email: Type.String(),
            password: Type.String(),
          })),
        }, Presenters.SessionShow, async function() {
          const { auth } = this.params;
          const user = await Models.User.findByEmail(auth.email);
          if (!user) {
            throw new StandardError(422, { code: "INVALID_AUTH", message: "invalid email or password" });
          }
          if (!user.checkPassword(auth.password)) {
            throw new StandardError(422, { code: "INVALID_AUTH", message: "invalid email or password" });
          }          
          return user;
        }),
    ],
  },
);
