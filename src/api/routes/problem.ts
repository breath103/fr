import { Namespace, Parameter, PresenterRouteFactory, StandardError } from "@serverless-seoul/corgi";
import { Type } from "@serverless-seoul/typebox";

// Models
import * as Models from "../../models";
import { ProblemContentSchema } from "../../models";
import { routeMetadata } from "../helper";

// Presenters
import * as Presenters from "../presenters";

export const route = new Namespace(
  "/problems", {}, {
    children: [
      // Problems
      PresenterRouteFactory.POST(
        "", {
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
        "/:problemId", {
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
