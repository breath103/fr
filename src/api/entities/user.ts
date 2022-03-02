import { Type } from "@serverless-seoul/typebox";

import { DataLayout } from "./layout";

export const Session = Type.Object({
  token: Type.String(),
  expiresAt: Type.Number(),
});
export const SessionShow = DataLayout(Session);

export const Me = Type.Object({
  id: Type.String(),
  email: Type.String(),
  nickname: Type.String(),
  emailVerification: Type.Union([Type.Literal("pending"), Type.Literal("verified")]),
});

export const MeShow = DataLayout(Me);
