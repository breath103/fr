import { Type } from "@serverless-seoul/typebox";
import { CommentContentSchema } from "../../models";

import { PaginatedDataLayout } from "./layout";
import { User } from "./user";

export const Comment = Type.Object({
  id: Type.String(),
  createdAt: Type.Number(),
  updatedAt: Type.Number(),
  author: User,
  content: CommentContentSchema,
});

export const CommentList = PaginatedDataLayout(Comment);
