import { createPresenter } from "./helper";

// Entities
import * as Entities from "../entities";

// Models
import * as Models from "../../models";
import { AuthService } from "../services/auth";

export const SessionShow = createPresenter(Entities.SessionShow, async (user: Models.User) => {
  return {
    data: {
      token: AuthService.createToken({ id: user.id }),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
    },
  };
});

export const MeShow = createPresenter(Entities.MeShow, async (user: Models.User) => {
  return {
    data: {
      id: user.id, 
      email: user.email,
      nickname: user.nickname,
      emailVerification: user.emailVerification?.status === "verified" ? "verified" : "pending",
    },
  };
});

export const UserShow = createPresenter(Entities.UserShow, async (user: Models.User) => {
  return {
    data: {
      id: user.id, 
      nickname: user.nickname,
    },
  };
});
