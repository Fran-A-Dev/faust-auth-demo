import { gql, useMutation } from "@apollo/client";
import { getApolloAuthClient, useAuth } from "@faustwp/core";
import { useEffect, useState } from "react";
import styles from "./CreatePost.module.scss";
import classNames from "classnames/bind";
let cx = classNames.bind(styles);

function useViewer() {
  const [viewer] = useState(null);

  const { isAuthenticated } = useAuth({
    shouldRedirect: true,
    strategy: "redirect",
    loginPageUrl: "/login",
  });

  useEffect(() => {
    if (isAuthenticated !== true) {
      return;
    }

    (async () => {
      const client = getApolloAuthClient();
    })();
  }, [isAuthenticated]);

  return viewer;
}

export default function Page(props, className) {
  const viewer = useViewer();
  const authClient = getApolloAuthClient();
  const [successMessage, setSuccessMessage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [createPost] = useMutation(
    gql`
      mutation CreatePost($title: String!, $content: String!) {
        createPost(
          input: { title: $title, content: $content, status: PUBLISH }
        ) {
          post {
            databaseId
          }
        }
      }
    `,
    { client: authClient }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({
        variables: { title, content },
      });
      setSuccessMessage("Post added successfully");
      setTitle("");
      setContent("");
    } catch (error) {
      console.error(error);
      setSuccessMessage("Failed to add post");
    }
  };

  return (
    <>
      {successMessage && (
        <p className={cx(["createsuccess-message", className])}>
          {successMessage}
        </p>
      )}
      <h1 className={cx(["header", className])}>Create A Post ✍🏽</h1>
      <form
        className={cx(["create-form", className])}
        method="post"
        onSubmit={handleSubmit}
      >
        <label
          className={cx(["create-label", className])}
          htmlFor="create-post-title"
        >
          Title
        </label>
        <input
          className={cx(["create-input", className])}
          type="text"
          id="create-post-title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label
          className={cx(["create-label", className])}
          htmlFor="create-post-content"
        >
          Content
        </label>
        <textarea
          className={cx(["create-input", className])}
          id="create-post-content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button className={cx(["create-button", className])} type="submit">
          Add Post
        </button>
      </form>
    </>
  );
}
