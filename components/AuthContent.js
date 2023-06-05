import { gql, useQuery } from "@apollo/client";
import { getApolloAuthClient, useAuth, useLogout } from "@faustwp/core";
import NavAuth from "./NavAuth";

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
              excerpt
            }
          }
          name
        }
      }
    `,
    { client }
  );
  console.log(data);
  if (loading) {
    return <>Loading...</>;
  }

  return (
    <>
      <NavAuth />
      <h1 className={cx(["header", className])}>
        Members Only Jackets- for authenticated eyes only 🥼🔐{" "}
      </h1>
      <p className={cx(["header", className])}>Welcome {data?.viewer?.name}!</p>

      <p className={cx(["body", className])}>
        If you are seeing My posts titles & excerpts, you have been
        authenticated! Stoked!
      </p>

      <ul className={cx(["ul", className])}>
        {data?.viewer?.posts?.nodes.map((post) => (
          <li className={cx(["li", className])} key={post.id}>
            <h2>{post.title}</h2>
            <p dangerouslySetInnerHTML={{ __html: post.excerpt }}></p>
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

export default function Page({ className }) {
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
        <p className={cx(["p", className])}>You have been logged out! </p>
      </div>
      <div className={cx(["container", className])}>
        <a className={cx(["a", className])} href={loginUrl}>
          Login Again Here to see Authenticated Content🔐
        </a>
      </div>
    </>
  );
}
