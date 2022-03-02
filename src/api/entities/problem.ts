import { Type } from "@serverless-seoul/typebox";
import { ProblemContentSchema } from "../../models";

import { DataLayout } from "./layout";

export const Problem = Type.Object({
  id: Type.String(),
  content: ProblemContentSchema,
});

export const ProblemShow = DataLayout(Problem);
