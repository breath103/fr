import { Namespace, Parameter, PresenterRouteFactory, StandardError } from "@serverless-seoul/corgi";
import { Type } from "@serverless-seoul/typebox";

// Models
import * as Models from "../../models";
import { routeMetadata } from "../helper";

// Presenters
import * as Presenters from "../presenters";

export const route = new Namespace(
  "/users", {}, {
    children: [
      PresenterRouteFactory.POST(
        "", {
          desc: "create new user",
          operationId: "createUser",
          metadata: routeMetadata({ access: "guest" }),
        }, {
          user: Parameter.Body(Type.Object({
            email: Type.String(),
            password: Type.String(),
            nickname: Type.String(),            
          })),
        }, Presenters.SuccessShow, async function() {
          const userPayload = this.params.user;
          const result = await Models.User.validateAndCreate(userPayload);

          if (result.type === "error") {
            throw new StandardError(422, { code: result.code, message: result.message });
          } 

          if (result.type === "success") {
            await result.user.startEmailValidation();
            return true;
          } else {
            // unreachable
            return false;
          }
        }),

      PresenterRouteFactory.GET(
        "/:userId", {
          desc: "create new user",
          operationId: "getUser",
          metadata: routeMetadata({ access: "guest" }),
        }, {
          userId: Parameter.Path(Type.String()),
        }, Presenters.UserShow, async function() {
          const user = await Models.User.findById(this.params.userId);
          if (!user) {
            throw new StandardError(422, { code: "USER_NOT_FOUND", message: "user not exists" });
          }
          return user;
        }),
    ],
  },
);
