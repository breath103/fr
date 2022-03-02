import { Namespace, Parameter, PresenterRouteFactory, StandardError } from "@serverless-seoul/corgi";
import { Type } from "@serverless-seoul/typebox";

// Models
import * as Models from "../../models";
import { ProblemContentSchema } from "../../models";
import { getCurrentUserId, routeMetadata } from "../helper";

// Presenters
import * as Presenters from "../presenters";

export const route = new Namespace(
  "", {}, {
    children: [
      PresenterRouteFactory.POST(
        "/users", {
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
      
      PresenterRouteFactory.POST(
        "/sessions", {
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

      PresenterRouteFactory.GET(
        "/me", {
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
      PresenterRouteFactory.POST(
        "/me/email-verification/restart", {
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
        "/me/email-verification/verify", {
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
        
      // Problems
      PresenterRouteFactory.POST(
        "/problems", {
          desc: "create problem for user",
          operationId: "createProblem",
          metadata: routeMetadata({ access: "user" }),
        }, {
          problem: Parameter.Body(Type.Object({
            content: ProblemContentSchema,
          })),
        }, Presenters.ProblemShow, async function() {
          const { problem: payload } = this.params;
          const problem = await Models.Problem.create({ content: payload.content });
          return problem;
        }),
      
      PresenterRouteFactory.GET(
        "/problems/:problemId", {
          desc: "create problem for user",
          operationId: "getProblem",
          metadata: routeMetadata({ access: "all" }),
        }, {
          problemId: Parameter.Path(Type.String()),
        }, Presenters.ProblemShow, async function() {
          const { problemId } = this.params;
          const problem = await Models.Problem.findById(problemId);
          if (!problem) {
            throw new StandardError(422, { code: "NOT_FOUND", message: "problem not found" });
          }
          return problem;
        }),
    ],
  },
);
