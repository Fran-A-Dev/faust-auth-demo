import { gql, useQuery } from "@apollo/client";
import { getApolloAuthClient, useAuth } from "@faustwp/core";
import { useLogout } from "@faustwp/core/dist/mjs";

function AuthenticatedView() {
  const client = getApolloAuthClient();
  const { logout } = useLogout();

  const { data, loading } = useQuery(
    gql`
      {
        viewer {
          posts {
            nodes {
              id
              title
            }
          }
          name
        }
      }
    `,
    { client }
  );

  if (loading) {
    return <>Loading...</>;
  }

  return (
    <>
      <p>Welcome {data?.viewer?.name}!</p>

      <p>If you are seeing My posts, you have been authenticated</p>

      <ul>
        {data?.viewer?.posts?.nodes.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>

      <button onClick={() => logout()}>Logout</button>
    </>
  );
}

export default function Page(props) {
  const { isAuthenticated, isReady, loginUrl } = useAuth({
    strategy: "local",
    shouldRedirect: false,
    loginPageUrl: "/log-in",
  });

  if (!isReady) {
    return <>Loading...</>;
  }

  if (isAuthenticated === true) {
    return <AuthenticatedView />;
  }

  return (
    <>
      <p>Welcome!</p>
      <a href={loginUrl}>Login</a>
    </>
  );
}
