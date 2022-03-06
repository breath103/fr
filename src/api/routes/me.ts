import { Namespace, Parameter, PresenterRouteFactory, StandardError } from "@serverless-seoul/corgi";
import { Type } from "@serverless-seoul/typebox";

// Models
import * as Models from "../../models";
import { getCurrentUserId, routeMetadata } from "../helper";

// Presenters
import * as Presenters from "../presenters";

export const route = new Namespace(
  "/me", {}, {
    children: [
      PresenterRouteFactory.GET(
        "", {
          desc: "create new session",
          operationId: "getMe",
          metadata: routeMetadata({ access: "user" }),
        }, {
        }, Presenters.MeShow, async function() {
          const user = await Models.User.findById(getCurrentUserId(this)!);
          if (!user) {
            throw new Error("This should not happen");
          }
          return user;
        }),

      // Email Verification
      new Namespace(
        "/email-verification", {}, {
          children: [
            PresenterRouteFactory.POST(
              "/restart", {
                desc: "verify email with token",
                operationId: "restartEmailVerification",
                metadata: routeMetadata({ access: "user" }),
              }, {
              }, Presenters.SuccessShow, async function() {
                const user = await Models.User.findById(getCurrentUserId(this)!);
                if (!user) {
                  throw new Error("This should not happen");
                }
      
                await user.startEmailValidation();
                return true;
              }),
      
            PresenterRouteFactory.POST(
              "/verify", {
                desc: "verify email with token",
                operationId: "verifyEmail",
                metadata: routeMetadata({ access: "user" }),
              }, {
                token: Parameter.Body(Type.String()),
              }, Presenters.SuccessShow, async function() {
                const { token } = this.params;
                const user = await Models.User.findById(getCurrentUserId(this)!);
                if (!user) {
                  throw new Error("This should not happen");
                }
      
                if (user.emailVerification?.status === "pending") {
                  if (user.emailVerification.token === token) {
                    if (user.emailVerification.expiresAt < Date.now()) {
                      throw new StandardError(422, { code: "TOKEN_EXPIRED", message: "token expired" });
                    } else {
                      user.emailVerification = { status: "verified" };
                      await user.save();
      
                      return true;
                    }
                  } else {
                    throw new StandardError(422, { code: "INVALID_TOKEN", message: "invalid token" });
                  }
                } else {
                  throw new StandardError(422, { code: "NOT_IN_EMAIL_VERIFCATION", message: "invalid status" });
                }
              }),
          ],
        }),
    ],
  },
);
