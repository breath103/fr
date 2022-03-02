import { createPresenter } from "./helper";

// Entities
import * as Entities from "../entities";

export const SuccessShow = createPresenter(Entities.SuccessShow, async (success: boolean) => {
  return {
    data: {
      success,
    },
  };
});
