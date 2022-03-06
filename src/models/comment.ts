import { Decorator, Query, Table } from "@serverless-seoul/dynamorm";
import { Static, Type } from "@serverless-seoul/typebox";
import * as _ from "lodash";
import { customAlphabet } from "nanoid";

export const CommentContentSchema = Type.Object({
  text: Type.String(),
  media: Type.Optional(Type.Union([
    Type.Object({
      type: Type.Literal("image"), 
      url: Type.String(),
      width: Type.Number(),
      height: Type.Number(),
    }),
  ])),
});
export type CommentContent = Static<typeof CommentContentSchema>; 
@Decorator.Table({ name: `fr_prod_comments` })
export class Comment extends Table {
  @Decorator.HashPrimaryKey("id")
  public static readonly primaryKey: Query.HashPrimaryKey<Comment, string>;

  @Decorator.FullGlobalSecondaryIndex("authorId", "createdAt")
  public static readonly userIdAndCreatedAtIndex: Query.FullGlobalSecondaryIndex<Comment, string, number>;

  @Decorator.FullGlobalSecondaryIndex("postId", "createdAt")
  public static readonly postIdAndCreatedAtIndex: Query.FullGlobalSecondaryIndex<Comment, string, number>;

  @Decorator.Writer()
  public static readonly writer: Query.Writer<Comment>;

  private static readonly generateId = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 12);

  public static async create(payload: { 
    authorId: string, postId: string, content: CommentContent,
  }) {
    const comment = new this();
    comment.id = this.generateId();
    comment.authorId = payload.authorId;
    comment.postId = payload.postId;
    comment.content = payload.content;
    comment.createdAt = Date.now();
    comment.updatedAt = Date.now();
    await comment.save();
    return comment;
  }

  public static async paginateByPostId(options: { 
    postId: string, sort: "ASC" | "DESC", count: number, after?: string
  }) {
    const result = await this.postIdAndCreatedAtIndex.query({
      hash: options.postId,      
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

  @Decorator.Attribute({ name: "postId" })
  public postId!: string;

  @Decorator.Attribute({ name: "authorId" })
  public authorId!: string;

  @Decorator.Attribute({ name: "createdAt" })
  public createdAt!: number;

  @Decorator.Attribute({ name: "updatedAt" })
  public updatedAt!: number;

  @Decorator.Attribute({ name: "content" })
  public content!: CommentContent;
}
