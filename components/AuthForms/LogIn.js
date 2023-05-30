import { useLogin } from "@faustwp/core";
import { useState } from "react";
import styles from "./LogIn.module.scss";
import classNames from "classnames/bind";
let cx = classNames.bind(styles);

export default function Login({ className }) {
  const [usernameEmail, setUsernameEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, data, error } = useLogin();

  return (
    <form
      className={cx(["login-form", className])}
      onSubmit={(e) => {
        e.preventDefault();

        login(usernameEmail, password, "/members");
      }}
    >
      <fieldset className={cx(["login-form fieldset", className])}>
        <label
          className={cx(["login-form label", className])}
          htmlFor="usernameEmail"
        >
          Login with your Username or Email
        </label>
        <input
          className={cx(["login-form input", className])}
          id="usernameEmail"
          type="text"
          disabled={loading === true}
          value={usernameEmail}
          onChange={(e) => setUsernameEmail(e.target.value)}
        />
      </fieldset>

      <fieldset>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          disabled={loading === true}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </fieldset>

      {data?.generateAuthorizationCode.error && (
        <p
          dangerouslySetInnerHTML={{
            __html: data.generateAuthorizationCode.error,
          }}
        />
      )}

      <fieldset>
        <button type="submit">Login</button>
      </fieldset>
    </form>
  );
}
