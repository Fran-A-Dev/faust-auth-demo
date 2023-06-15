import { useMutation, gql } from "@apollo/client";
import { useState } from "react";
import styles from "./SendPasswordresetForm.module.scss";
import classNames from "classnames/bind";

let cx = classNames.bind(styles);

const SEND_PASSWORD_RESET_EMAIL = gql`
  mutation sendPasswordResetEmail($username: String!) {
    sendPasswordResetEmail(input: { username: $username }) {
      user {
        databaseId
      }
    }
  }
`;

export default function SendPasswordresetForm({ className }) {
  const [sendPasswordResetEmail, { loading, error, data }] = useMutation(
    SEND_PASSWORD_RESET_EMAIL
  );
  const wasEmailSent = Boolean(
    data &&
      data.sendPasswordResetEmail &&
      data.sendPasswordResetEmail.user &&
      data.sendPasswordResetEmail.user.databaseId
  );

  const [email, setEmail] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const { email } = Object.fromEntries(data);
    sendPasswordResetEmail({
      variables: {
        username: email,
      },
    }).catch((error) => {
      console.error(error);
    });
    setEmail("");
    alert("Check your email for a password reset link.");
  }

  if (wasEmailSent) {
    return (
      <p>
        {" "}
        Please check your email. A password reset link has been sent to you.
      </p>
    );
  }

  return (
    <form
      className={cx("reset-form", className)}
      method="post"
      onSubmit={handleSubmit}
    >
      <p>
        Enter the email associated with your account and you&#39;ll be sent a
        link to reset your password.
      </p>
      <fieldset
        className={cx("reset-fieldset", className)}
        disabled={loading}
        aria-busy={loading}
      >
        <label
          className={cx("reset-label", className)}
          htmlFor="password-reset-email"
        >
          Email
        </label>
        <input
          className={cx("reset-input", className)}
          id="password-reset-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error ? <p className="error-message">{error.message}</p> : null}
        <button
          className={cx("reset-button", className)}
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send password reset email"}
        </button>
      </fieldset>
    </form>
  );
}
