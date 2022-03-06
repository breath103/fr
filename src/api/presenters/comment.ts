import { createPresenter } from "./helper";
import * as _ from "lodash";

// Entities
import * as Entities from "../entities";

// Models
import * as Models from "../../models";
import { UserShow } from ".";

export const CommentList = createPresenter(
  Entities.CommentList, 
  async ({ data, after }: { 
    data: Models.Comment[],
    after?: string,
  }) => {
    const authors = await Models.User.findByIds(_.chain(data).map((post) => post.authorId).uniq().value());
    const authorsMap = new Map(authors.map((author) => [author.id, author]));

    return {
      data: await Promise.all(data.map(async (comment) => ({
        id: comment.id,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        author: (await UserShow.present(authorsMap.get(comment.authorId)!)).data,
        content: comment.content,
      }))),
      paging: { 
        after,
      },
    };
  });
