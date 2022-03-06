import { createPresenter } from "./helper";
import * as _ from "lodash";

// Entities
import * as Entities from "../entities";

// Models
import * as Models from "../../models";
import { UserShow } from ".";

export const SimplePostList = createPresenter(Entities.SimplePostList, async ({ data, after }: { data: Models.Post[],
  after?: string,
}) => {
  const authors = await Models.User.findByIds(_.chain(data).map((post) => post.authorId).uniq().value());
  const authorsMap = new Map(authors.map((author) => [author.id, author]));

  return {
    data: await Promise.all(data.map(async (post) => ({
      id: post.id,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: (await UserShow.present(authorsMap.get(post.authorId)!)).data,
      title: post.title,
    }))),
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
      author: (await UserShow.present((await Models.User.findById(post.authorId))!)).data,
      title: post.title,
      content: post.content,
    },
  };
});
