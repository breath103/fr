import { RoutingContext } from "@serverless-seoul/corgi";
import { AuthenticationMiddleware } from "./middlewares/authentication";

// Authentcation Helpers
export function getCurrentAuthentication(context: RoutingContext<any>) {
  const auth = context.router.findMiddleware(AuthenticationMiddleware)!.getCurrentAuthentication();
  return auth;
}

export function getCurrentUser(context: RoutingContext<any>) {
  const auth = context.router.findMiddleware(AuthenticationMiddleware)!.getCurrentAuthentication();
  if (auth.type !== "user") {
    return null;
  }

  return {
    id: auth.userId,
  };
}

export function getCurrentUserId(context: RoutingContext<any>) {
  const user = getCurrentUser(context);
  if (user) {
    return user.id;
  } else {
    return undefined;
  }
}

export function getCurrentUserIP(context: RoutingContext<any>) {
  return context.request.requestContext!.identity.sourceIp;
}

export function getCurrentUserAgent(context: RoutingContext<any>) {
  return context.request.requestContext!.identity.userAgent!;
}

export function routeMetadata(options: {
  access: "user" | "guest" | "all";
}) {
  return new Map([
    [AuthenticationMiddleware, { access: options.access }],
  ]);
}
