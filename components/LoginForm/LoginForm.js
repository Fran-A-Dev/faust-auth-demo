import { useLogin } from "@faustwp/core";
import { useState } from "react";
import Link from "next/link";

import styles from "./LoginForm.module.scss";
import classNames from "classnames/bind";
let cx = classNames.bind(styles);

export default function LoginForm({ className }) {
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
      <div className={cx(["div", className])}>
        <Link href="/forgot-password">
          <a className={cx(["a", className])}>
            🤷🏽‍♂️ Forgot password? Click Here! 👈🏽
          </a>
        </Link>
      </div>
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
      <p className={cx(["p", className])}>
        Don&#39;t have an account yet?{" "}
        <Link href="/sign-up">
          <a>Sign up here! 👈🏽</a>
        </Link>
      </p>
    </form>
  );
}
