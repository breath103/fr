import * as JWT from "jsonwebtoken";
import { key } from "./private-key.json";
export interface JWTPayload {
  id: string; // UserId
  // iat: number; // JWT signed timestamp
}

export class AuthService {
  public static createToken(user: { id: string }) {
    const payload: JWTPayload = { id: user.id };
    return JWT.sign(payload, key, { algorithm: "HS256" });
  }

  public static parseToken(token: string) {
    if (token) {
      try {
        return JWT.verify(token, key, { algorithms: ["HS256"] }) as JWTPayload;
      } catch (error) {
        return null;
      }
    } else {
      return null;
    }
  }
}
