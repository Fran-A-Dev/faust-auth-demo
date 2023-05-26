import { gql, useMutation } from "@apollo/client";
import { getApolloAuthClient, useAuth } from "@faustwp/core";
import { useEffect, useState } from "react";

function useViewer() {
  const [viewer, setViewer] = useState(null);

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

export default function Page(props) {
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
      {successMessage && <p>{successMessage}</p>}
      <form method="post" onSubmit={handleSubmit}>
        <label htmlFor="create-post-title">Title</label>
        <input
          type="text"
          id="create-post-title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="create-post-content">Content</label>
        <textarea
          id="create-post-content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button type="submit">Add Post</button>
      </form>
    </>
  );
}
