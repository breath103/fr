import { Decorator, Query, Table } from "@serverless-seoul/dynamorm";

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
  public content!: {
    text: string,
    media?: { type: "image", url: string, width: number, height: number };
  }
}
