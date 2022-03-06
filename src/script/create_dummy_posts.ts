import { faker } from '@faker-js/faker';
import { Comment, Post, User } from '../models';
import * as _ from "lodash";

async function main() {
  const user = (await User.primaryKey.scan({ limit: 1 })).records[0]!;

  // First cleanup all posts that is dummy
  {
    let key = undefined as any;
    const dummyPosts: Post[] = [];
    do {
      const res = await Post.primaryKey.scan({ exclusiveStartKey: key });
      key = res.lastEvaluatedKey;
      dummyPosts.push(...res.records.filter((post) => post.title.startsWith("dummy ")));
    } while(key);

    console.log("Deleting Dummy Posts...", dummyPosts.length);

    await Promise.all(
      dummyPosts.map((p) => p.delete()),
    );
  }

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
      
      for (let j = 0; j < faker.datatype.number({ min: 1, max: 10 }); j ++) {
        await Comment.create({
          authorId: user.id,
          postId: post.id,
          content: {
            text: faker.lorem.sentence(),
          },        
        });
      }
    }    
  }
}

main().then(console.log, console.log);