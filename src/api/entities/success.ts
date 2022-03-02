import { Type } from "@serverless-seoul/typebox";

import { DataLayout } from "./layout";

export const Success = Type.Object({
  success: Type.Boolean(),
});

export const SuccessShow = DataLayout(Success);