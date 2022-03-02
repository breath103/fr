import { Decorator, Query, Table } from "@serverless-seoul/dynamorm";
import { Static, Type } from "@serverless-seoul/typebox";
import { customAlphabet } from "nanoid";

@Decorator.Table({ name: `fr_prod_problems` })
export class Problem extends Table {
  @Decorator.HashPrimaryKey("id")
  public static readonly primaryKey: Query.HashPrimaryKey<Problem, string>;

  @Decorator.Writer()
  public static readonly writer: Query.Writer<Problem>;

  @Decorator.Attribute({ name: "id" })
  public id!: string;

  @Decorator.Attribute({ name: "content" })
  public content!: ProblemContent;

  private static readonly generateId = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 16);

  public static async create(payload: { content: ProblemContent }) {
    const record = new this();
    record.id = this.generateId();
    record.content = payload.content;
    await record.save();
    return record;
  }

  public static async findById(id: string) {
    return await this.primaryKey.get(id);
  }
}

export const ProblemContentSchema = Type.Union([
  Type.Object({
    type: Type.Literal("read-and-choose-v1"),
    question: Type.String(),
    questionImage: Type.String(),
    choices: Type.Array(Type.String()),
    answerIndex: Type.Number(Type.Number()),
  }),
]);

export type ProblemContent = Static<typeof ProblemContentSchema>;