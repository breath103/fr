import { createPresenter } from "./helper";

// Entities
import * as Entities from "../entities";

// Models
import * as Models from "../../models";

export const ProblemShow = createPresenter(Entities.ProblemShow, async (problem: Models.Problem) => {
  return {
    data: {
      id: problem.id, 
      content: problem.content,
    },
  };
});
