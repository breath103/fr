import { faker } from '@faker-js/faker';
import { Post, User } from '../models';
import * as _ from "lodash";

async function main() {
  const user = (await User.primaryKey.scan({ limit: 1 })).records[0]!;
  for (const boardId of ["human", "troll"] as const) {
    for (let i = 0; i < 100; i ++) {
      const post = await Post.create({
        authorId: user.id,
        boardId: boardId,
        title: `dummy ${faker.lorem.sentence()}`,
        content: {
          blocks: [
            ..._.times(faker.datatype.number({ min: 1, max: 10 }), () => ({
              type: "text" as const,
              text: faker.random.words(256),
            })),
          ],
        },
      });
      console.log("Created post", post.id);
    }    
  }
}

main().then(console.log, console.log);