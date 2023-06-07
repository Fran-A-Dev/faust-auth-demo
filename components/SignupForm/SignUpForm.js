import { useMutation, gql } from "@apollo/client";
import Link from "next/link";
import styles from "./Signup.module.scss";
import classNames from "classnames/bind";

let cx = classNames.bind(styles);

const REGISTER_USER = gql`
  mutation registerUser(
    $email: String!
    $firstName: String!
    $lastName: String!
  ) {
    registerUser(
      input: {
        username: $email
        email: $email
        firstName: $firstName
        lastName: $lastName
      }
    ) {
      user {
        databaseId
      }
    }
  }
`;

export default function SignUpForm({ className }) {
  const [register, { data, loading, error }] = useMutation(REGISTER_USER);
  const wasSignUpSuccessful = Boolean(
    data &&
      data.registerUser &&
      data.registerUser.user &&
      data.registerUser.user.databaseId
  );

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(data);
    register({
      variables: values,
    }).catch((error) => {
      console.error(error);
    });
  }

  if (wasSignUpSuccessful) {
    return (
      <p className={cx(["signup-message", className])}>
        Thanks! Check your email – an account confirmation link has been sent to
        you.
      </p>
    );
  }

  return (
    <form
      className={cx(["signup-form", className])}
      method="post"
      onSubmit={handleSubmit}
    >
      <fieldset disabled={loading} aria-busy={loading}>
        <label
          className={cx(["signup-label", className])}
          htmlFor="sign-up-first-name"
        >
          First name
        </label>
        <input
          className={cx(["signup-input", className])}
          id="sign-up-first-name"
          type="text"
          name="firstName"
          autoComplete="given-name"
          required
        />
        <label
          className={cx(["signup-label", className])}
          htmlFor="sign-up-last-name"
        >
          Last name
        </label>
        <input
          className={cx(["signup-input", className])}
          id="sign-up-first-name"
          type="text"
          name="lastName"
          autoComplete="family-name"
          required
        />
        <label
          className={cx(["signup-label", className])}
          htmlFor="sign-up-email"
        >
          Email
        </label>
        <input
          className={cx(["signup-input", className])}
          id="sign-up-email"
          type="email"
          name="email"
          autoComplete="username"
          required
        />
        {error ? (
          error.message.includes("This username is already registered") ? (
            <p className="error-message">
              You're already signed up! <Link href="/log-in">Log in</Link>
            </p>
          ) : (
            <p className="error-message">{error.message}</p>
          )
        ) : null}
        <button
          className={cx(["signup-button", className])}
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </fieldset>
      <p>
        Already have an account? Go To The
        <Link href="/log-in">
          <a className={cx(["a", className])}>Log in Page</a>
        </Link>
      </p>
    </form>
  );
}
