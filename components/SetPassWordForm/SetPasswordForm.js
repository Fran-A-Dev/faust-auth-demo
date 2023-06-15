import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import Link from "next/link";
import styles from "./SetPasswordForm.module.scss";
import classNames from "classnames/bind";

let cx = classNames.bind(styles);

const RESET_PASSWORD = gql`
  mutation resetUserPassword(
    $key: String!
    $login: String!
    $password: String!
  ) {
    resetUserPassword(
      input: { key: $key, login: $login, password: $password }
    ) {
      user {
        databaseId
      }
    }
  }
`;

export default function SetPasswordForm({ resetKey, login }) {
  console.log(login);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [clientErrorMessage, setClientErrorMessage] = useState("");
  const [resetPassword, { data, loading, error }] = useMutation(RESET_PASSWORD);
  const wasPasswordReset = Boolean(data?.resetUserPassword?.user?.databaseId);

  function handleSubmit(event) {
    event.preventDefault();
    const isValid = validate();
    if (!isValid) return;

    resetPassword({
      variables: {
        key: resetKey,
        login: login,
        password,
      },
    }).catch((error) => {
      console.error(error);
    });
  }

  function validate() {
    setClientErrorMessage("");

    const isPasswordLongEnough = password.length >= 5;
    if (!isPasswordLongEnough) {
      setClientErrorMessage("Password must be at least 5 characters.");
      return false;
    }

    const doPasswordsMatch = password === passwordConfirm;
    if (!doPasswordsMatch) {
      setClientErrorMessage("Passwords must match.");
      return false;
    }

    return true;
  }

  if (wasPasswordReset) {
    return (
      <>
        <p className={cx("p")}>Your new password has been set Stoked!🙌🏽</p>
        <div className={cx("div-tag")}>
          <Link href="/log-in">
            <a className={cx("a-tag")}>Log in Here 👈🏽</a>
          </Link>
        </div>
      </>
    );
  }

  return (
    <form className={cx("set-form")} method="post" onSubmit={handleSubmit}>
      <fieldset
        className={cx("set-fieldset")}
        disabled={loading}
        aria-busy={loading}
      >
        <label className={cx("set-label")} htmlFor="new-password">
          Password
        </label>
        <input
          className={cx("set-input")}
          id="new-password"
          type="password"
          value={password}
          autoComplete="new-password"
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <label className={cx("set-label")} htmlFor="password-confirm">
          Confirm Password
        </label>
        <input
          className={cx("set-input")}
          id="password-confirm"
          type="password"
          value={passwordConfirm}
          autoComplete="new-password"
          onChange={(event) => setPasswordConfirm(event.target.value)}
          required
        />
        {clientErrorMessage ? (
          <p className="error-message">{clientErrorMessage}</p>
        ) : null}
        {error ? <p className="error-message">{error.message}</p> : null}
        <button className={cx("set-button")} type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save password"}
        </button>
      </fieldset>
    </form>
  );
}
