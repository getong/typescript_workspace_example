import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import axios from "axios";

type PostId = {
  postId: string;
};

type Post = {
  id: number;
  title: string;
  body: string;
};

export const fetchPost = createServerFn({ method: "GET" })
  .validator((d: PostId) => d)
  .handler(async ({ data }) => {
    const post = await axios
      .get<Post>(`https://jsonplaceholder.typicode.com/posts/${data.postId}`)
      .then((r) => r.data)
      .catch((err) => {
        console.error(err);
        if (err.status === 404) {
          throw notFound();
        }
        throw err;
      });

    return post;
  });
