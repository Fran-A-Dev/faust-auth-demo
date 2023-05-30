import { gql, useQuery } from "@apollo/client";
import { getApolloAuthClient, useAuth } from "@faustwp/core";
import { useLogout } from "@faustwp/core/dist/mjs";
import styles from "./AuthContent.module.scss";
import classNames from "classnames/bind";

let cx = classNames.bind(styles);

function AuthenticatedView({ className }) {
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
      <h1 className={cx(["header", className])}>
        Members Only Jackets- for authenticated eyes only 🥼🔐{" "}
      </h1>
      <p className={cx(["header", className])}>Welcome {data?.viewer?.name}!</p>

      <p className={cx(["body", className])}>
        If you are seeing My posts titles, you have been authenticated! Stoked!
      </p>

      <ul className={cx(["ul", className])}>
        {data?.viewer?.posts?.nodes.map((post) => (
          <li className={cx(["li", className])} key={post.id}>
            {post.title}
          </li>
        ))}
      </ul>
      <div className={cx(["container", className])}>
        <button className={cx(["button", className])} onClick={() => logout()}>
          Logout
        </button>
      </div>
    </>
  );
}

export default function Page({ props, className }) {
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
      <div className={cx(["container", className])}>
        <p className={cx(["p", className])}>Welcome Stranger! 👮 </p>
      </div>
      <div className={cx(["container", className])}>
        <a className={cx(["a", className])} href={loginUrl}>
          Login Here Please!
        </a>
      </div>
    </>
  );
}
