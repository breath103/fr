import { Type } from "@serverless-seoul/typebox";
import { PostContentSchema } from "../../models";

import { DataLayout, PaginatedDataLayout } from "./layout";

export const SimplePost = Type.Object({
  id: Type.String(),
  createdAt: Type.Number(),
  updatedAt: Type.Number(),
  title: Type.String(),
});

export const SimplePostList = PaginatedDataLayout(SimplePost);

export const Post = Type.Intersect([
  SimplePost,
  Type.Object({
    content: PostContentSchema,
  }),
]);
export const PostShow = DataLayout(Post);
