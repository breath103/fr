import { createPresenter } from "./helper";

// Entities
import * as Entities from "../entities";

// Models
import * as Models from "../../models";

export const SimplePostList = createPresenter(Entities.SimplePostList, async ({ data, after }: { data: Models.Post[],
  after?: string,
}) => {
  return {
    data: data.map((post) => ({
      id: post.id,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      title: post.title,
    })),
    paging: { 
      after,
    },
  };
});

export const PostShow = createPresenter(Entities.PostShow, async (post: Models.Post) => {
  return {
    data: {
      id: post.id,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      title: post.title,
      content: post.content,
    },
  };
});
