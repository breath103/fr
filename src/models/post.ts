import { Decorator, Query, Table } from "@serverless-seoul/dynamorm";
import { Static, Type } from "@serverless-seoul/typebox";

import * as _ from "lodash";
import { customAlphabet } from "nanoid";

export const BoardIdSchema = Type.Union([ Type.Literal("human"), Type.Literal("troll") ]);
export type BoardId = Static<typeof BoardIdSchema>;

export const PostContentSchema = Type.Object({
  blocks: Type.Array(Type.Union([
    Type.Object({
      type: Type.Literal("text"),
      text: Type.String(),
    }),
    Type.Object({
      type: Type.Literal("image"),
      url: Type.String(),
      width: Type.Number(),
      height: Type.Number(),
    }),
  ])),
});
export type PostContent = Static<typeof PostContentSchema>;

@Decorator.Table({ name: `fr_prod_posts` })
export class Post extends Table {
  @Decorator.HashPrimaryKey("id")
  public static readonly primaryKey: Query.HashPrimaryKey<Post, string>;

  @Decorator.FullGlobalSecondaryIndex("authorId", "createdAt")
  public static readonly userIdAndCreatedAtIndex: Query.FullGlobalSecondaryIndex<Post, string, number>;

  @Decorator.FullGlobalSecondaryIndex("boardId", "createdAt")
  public static readonly boardIdAndCreatedAtIndex: Query.FullGlobalSecondaryIndex<Post, BoardId, number>;

  @Decorator.Writer()
  public static readonly writer: Query.Writer<Post>;
  
  private static readonly generateId = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 6);

  public static async create(payload: {
    authorId: string,
    boardId: BoardId,
    title: string, 
    content: PostContent,
  }) {
    const post = new this();
    post.id = this.generateId();
    post.authorId = payload.authorId;
    post.boardId = payload.boardId;
    post.title = payload.title;
    post.content = payload.content;
    post.createdAt = Date.now();
    post.updatedAt = Date.now();
    await post.save();
    return post;
  }

  public static async findById(id: string) {
    return await this.primaryKey.get(id);
  }

  public static async paginateByBoardId(options: { 
    boardId: BoardId, sort: "ASC" | "DESC", count: number, after?: string
  }) {
    const result = await this.boardIdAndCreatedAtIndex.query({
      hash: options.boardId,      
      rangeOrder: options.sort,
      range: options.after ? (
        options.sort === "DESC" ? 
          ["<=", Number(options.after)] : 
          [">=", Number(options.after)]
      ) : undefined,
      limit: options.count,
    });

    return {
      data: result.records,
      after: 
        _.chain(result.records)
          .last()
          .thru((record) => (record?.createdAt) ? record.createdAt.toString() : undefined)
          .value(),
    };
  }

  @Decorator.Attribute({ name: "id" })
  public id!: string;

  @Decorator.Attribute({ name: "boardId" })
  public boardId!: BoardId; // boardId

  @Decorator.Attribute({ name: "authorId" })
  public authorId!: string; // author user id

  @Decorator.Attribute({ name: "createdAt" })
  public createdAt!: number;

  @Decorator.Attribute({ name: "updatedAt" })
  public updatedAt!: number;

  @Decorator.Attribute({ name: "title" })
  public title!: string;

  @Decorator.Attribute({ name: "content" })
  public content!: PostContent;
}
