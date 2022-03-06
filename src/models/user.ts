import { Decorator, Query, Table } from "@serverless-seoul/dynamorm";
import { customAlphabet } from "nanoid";
import * as bcrypt from "bcryptjs";

import * as SES from "aws-sdk/clients/ses";
import MailComposer = require("nodemailer/lib/mail-composer");

@Decorator.Table({ name: `fr_prod_users` })
export class User extends Table {
  @Decorator.HashPrimaryKey("id")
  public static readonly primaryKey: Query.HashPrimaryKey<User, string>;

  @Decorator.HashGlobalSecondaryIndex("email")
  public static readonly emailIndex: Query.HashGlobalSecondaryIndex<User, string>;

  @Decorator.HashGlobalSecondaryIndex("nickname")
  public static readonly nicknameIndex: Query.HashGlobalSecondaryIndex<User, string>;

  @Decorator.Writer()
  public static readonly writer: Query.Writer<User>;

  public static async validateAndCreate(payload: { email: string, password: string, nickname: string }): Promise<
    { type: "error", code: string, message: string } | { type: "success", user: User }
  > {
    if (await User.findByEmail(payload.email)) {
      return { type: "error", code: "INVALID_EMAIL", message: "email already exists" };
    }
    if (new RegExp(`^[^\\.\\s@:](?:[^\\s@:]*[^\\s@:\\.])?@[^\\.\\s@]+(?:\\.[^\\.\\s@]+)*$`).test(payload.email) === false) {
      return { type: "error", code: "INVALID_EMAIL", message: "email is malformed" };
    }

    if (payload.password.length < 8) {
      return { type: "error", code: "INVALID_PASSSWORD", message: "password is malformed" };
    }

    if (await User.findByNickname(payload.nickname)) {
      return { type: "error", code: "INVALID_NICKNAME", message: "nickname already exists" };
    }
    if (/([ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z|A-Z|1-9]){4,8}/gm.test(payload.nickname) === false) {
      return { type: "error", code: "INVALID_NICKNAME", message: "nickname is malformed" };
    }

    const user = new User();
    user.id = this.generateId();
    user.email = payload.email;
    user.setEncryptedPassword(payload.password);
    user.nickname = payload.nickname;
    await user.save();

    return { type: "success", user };
  }

  public async startEmailValidation() {
    const emailVerification = {
      status: "pending" as const,
      token: customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 4)(),
      expiresAt: Date.now() + 1000 * 60 * 30,
    };
    this.emailVerification = emailVerification;
    await this.save();
    
    // Actually send email
    const mail = new MailComposer({
      // from: "admin@sorry-sejong.com",
      from: "admin@kurtlee.me",
      to: this.email,
      subject: "이메일 인증 요청",
      // text: this.ctx.message.text,
      html: `인증 코드 <b>${emailVerification.token}</b>`,
    }).compile();
    const ses = new SES({});

    await ses.sendRawEmail({
      Destinations: [this.email],
      RawMessage: {
        Data: await mail.build(),
      },
    }).promise();
  }

  public static async findById(id: string): Promise<User | null> {
    return await this.primaryKey.get(id);
  }

  // Ids has to be unique
  public static async findByIds(ids: string[]) {
    return (await this.primaryKey.batchGet(ids)).records;
  }

  public static async findByEmail(email: string): Promise<User | null> {
    return (await this.emailIndex.query(email)).records[0] || null;
  }

  public static async findByNickname(nickname: string): Promise<User | null> {
    return (await this.nicknameIndex.query(nickname)).records[0] || null;
  }

  private static readonly generateId = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 16);
  private static readonly userPasswordSalt = "$2a$10$1bxe7.qCPhSOaBFAJ4jiX."; // @TODO move to parameter store

  @Decorator.Attribute({ name: "id" })
  public id!: string;

  @Decorator.Attribute({ name: "email" })
  public email!: string;

  @Decorator.Attribute({ name: "nickname" })
  public nickname!: string;

  @Decorator.Attribute({ name: "isHuman" })
  public isHuman: boolean = false;

  @Decorator.Attribute({ name: "encryptedPassword" })
  public encryptedPassword!: string;
  
  private setEncryptedPassword(password: string) {
    this.encryptedPassword = bcrypt.hashSync(password, User.userPasswordSalt);
  }

  public checkPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.encryptedPassword);
  }
  
  @Decorator.Attribute({ name: "emailVerification" })
  public emailVerification!: {
    status: "pending",
    token: string, 
    expiresAt: number, // When does recovery become invalid 
  } | {
    status: "verified",
  } | null;

  @Decorator.Attribute({ name: "passwordRecovery" })
  public passwordRecovery!: {
    token: string, 
    expiresAt: number, // When does recovery become invalid 
  } | null;  
}
