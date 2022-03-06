import { Routes } from "@serverless-seoul/corgi";

import { route as UserRoute } from "./user";
import { route as MeRoute } from "./me";
import { route as ProblemRoute } from "./problem";
import { route as SessionRoute } from "./session";
import { route as PostRoute } from "./post";

export const routes: Routes = [
  UserRoute,
  MeRoute,
  ProblemRoute,
  SessionRoute,
  PostRoute,
];
