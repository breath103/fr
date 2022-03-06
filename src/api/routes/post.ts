import { Namespace, Parameter, PresenterRouteFactory, StandardError } from "@serverless-seoul/corgi";
import { Type } from "@serverless-seoul/typebox";

// Models
import * as Models from "../../models";
import { BoardIdSchema, PostContentSchema } from "../../models";
import { getCurrentUserId, routeMetadata } from "../helper";

// Presenters
import * as Presenters from "../presenters";

export const route = new Namespace(
  "/posts", {}, {
    children: [
      PresenterRouteFactory.POST(
        "", {
          desc: "create new post",
          operationId: "createPost",
          metadata: routeMetadata({ access: "user" }),
        }, {
          post: Parameter.Body(Type.Object({
            title: Type.String(),
            boardId: BoardIdSchema,
            content: PostContentSchema,
          })),
        }, Presenters.PostShow, async function() {
          // Check authortiy 
          const author = await Models.User.findById(getCurrentUserId(this)!);
          if (!author) {
            throw new StandardError(422, { code: "NOT_FOUND", message: "user not found" });
          }

          if (this.params.post.boardId === "human") {
            if (!author.isHuman) {
              throw new StandardError(403, { code: "NOT_ALLOWED", message: "you are not human" });
            }
          }

          const post = await Models.Post.create({
            authorId: author.id,
            ...this.params.post,
          });          
          return post;
        }),

      PresenterRouteFactory.GET(
        "/for-board", {
          desc: "create new session",
          operationId: "getPostsForBoard",
          metadata: routeMetadata({ access: "guest" }),
        }, {
          boardId: Parameter.Query(BoardIdSchema),
          after: Parameter.Query(Type.Optional(Type.String())),
          count: Parameter.Query(Type.Optional(Type.Number())),
        }, Presenters.SimplePostList, async function() {
          const { data, after } = await Models.Post.paginateByBoardId({
            boardId: this.params.boardId,
            sort: "DESC",
            count: this.params.count ?? 36,    
            after: this.params.after,
          });
          return { data, after };
        }),

      new Namespace(
        "/:postId", {
          postId: Type.String(),
        }, {
          children: [
            PresenterRouteFactory.GET(
              "", {
                desc: "get post",
                operationId: "getPost",
                metadata: routeMetadata({ access: "guest" }),
              }, {}, Presenters.PostShow, async function() {
                return await fetchPost(this.params.postId);
              }),
          ],
        }),
    ],
  },
);

async function fetchPost(postId: string): Promise<Models.Post> {
  const post = await Models.Post.findById(postId);
  if (!post) {
    throw new StandardError(422, { code: "POST_NOT_FOUND", message: "post not exists" });
  }
  return post;
}