import { Middleware, MiddlewareAfterOptions, MiddlewareBeforeOptions } from "@serverless-seoul/corgi";

// Services
import { AuthService } from "../services/auth";

export type Authentication = {
  type: "user";
  userId: string;
} | {
  type: "guest";
  guestId: string;
};

export interface AuthenticationMiddlewareMetadata {
  access: Authentication["type"] | "all";
}

const applicatioPrefix = "fr";
export class AuthenticationMiddleware implements Middleware<AuthenticationMiddlewareMetadata> {
  public static readonly headerNames = Object.freeze({
    AuthToken: `x-${applicatioPrefix}-auth-token`,
    UserAgent: `x-${applicatioPrefix}-user-agent`,
    userAgent: "user-agent",
  });

  private currentAuthentication: Authentication | null = null;

  // Try to find user depends on context
  public async before(options: MiddlewareBeforeOptions<AuthenticationMiddlewareMetadata>) {
    const { metadata, routingContext } = options;

    // Setup currentUser
    const token = routingContext.headers[AuthenticationMiddleware.headerNames.AuthToken] || "";
    this.currentAuthentication = this.parseAuthenticationToken(token);
    if (!this.currentAuthentication) {
      return options.routingContext.json({
        error: {
          message: `invalid token: ${token}`,
          code: "UNAUTHORIZED",
        },
      }, 401);
    }

    const access = metadata && metadata.access || "all";
    switch (access) {
      case "user":
      case "guest":
        if (access !== this.currentAuthentication.type) {
          return options.routingContext.json({
            error: {
              message: "Unauthorized",
              code: "UNAUTHORIZED",
            },
          }, 401);
        }
        break;
      case "all":
        break;
    }
  }

  public async after(options: MiddlewareAfterOptions<AuthenticationMiddlewareMetadata>) {
    const { response } = options;
    return response;
  }

  public getCurrentAuthentication() {
    if (!this.currentAuthentication) {
      // this should not happen.
      throw new Error("Not authenticated");
    }

    return this.currentAuthentication;
  }

  public parseAuthenticationToken(token: string): Authentication | null {
    if (token.startsWith("guest:")) {
      const guestId = token.substring(6);
      return { type: "guest", guestId };
    } else if (token) {
      const user = AuthService.parseToken(token);
      if (user) {
        return { type: "user", userId: user.id };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}
