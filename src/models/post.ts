import { Decorator, Query, Table } from "@serverless-seoul/dynamorm";

@Decorator.Table({ name: `fr_prod_posts` })
export class Post extends Table {
  @Decorator.HashPrimaryKey("id")
  public static readonly primaryKey: Query.HashPrimaryKey<Post, string>;

  @Decorator.Writer()
  public static readonly writer: Query.Writer<Post>;

  @Decorator.Attribute({ name: "id" })
  public id!: string;

  @Decorator.Attribute({ name: "content" })
  public content!: {
    type: "read-and-choose",
  };
}
