import { gql, useMutation } from "@apollo/client";
import { getApolloAuthClient, useAuth } from "@faustwp/core";
import { useEffect, useState } from "react";
import styles from "./ProfileForm.module.scss";
import classNames from "classnames/bind";
let cx = classNames.bind(styles);

function useViewer() {
  const [viewer, setViewer] = useState(null);

  const { isAuthenticated } = useAuth({
    shouldRedirect: true,
    strategy: "local",
    loginPageUrl: "/log-in",
  });

  useEffect(() => {
    if (isAuthenticated !== true) {
      return;
    }

    (async () => {
      const client = getApolloAuthClient();

      const { data } = await client.query({
        query: gql`
          query GetViewer {
            viewer {
              id
              email
              firstName
              lastName
            }
          }
        `,
      });

      setViewer(data?.viewer || null);
    })();
  }, [isAuthenticated]);

  return viewer;
}

export default function Page({ props, className }) {
  const viewer = useViewer();
  const authClient = getApolloAuthClient();
  const [successMessage, setSuccessMessage] = useState();
  const [firstName, setFirstName] = useState(viewer?.firstName || "");
  const [lastName, setLastName] = useState(viewer?.lastName || "");
  const [email, setEmail] = useState(viewer?.email || "");

  useEffect(() => {
    setFirstName(viewer?.firstName || "");
    setLastName(viewer?.lastName || "");
    setEmail(viewer?.email || "");
  }, [viewer]);

  const [updateProfile] = useMutation(
    gql`
      mutation UpdateProfile(
        $id: ID!
        $firstName: String!
        $lastName: String!
        $email: String!
      ) {
        updateUser(
          input: {
            id: $id
            firstName: $firstName
            lastName: $lastName
            email: $email
          }
        ) {
          user {
            id
            email
            firstName
            lastName
          }
        }
      }
    `,
    { client: authClient }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        variables: { firstName, lastName, email, id: viewer.id },
      });
      setSuccessMessage("Profile updated successfully");
      setFirstName("");
      setLastName("");
      setEmail("");
    } catch (error) {
      // Handle error if the update fails
      console.error(error);
      setSuccessMessage("Profile update failed");
    }
  };

  return (
    <>
      {successMessage && (
        <p className={cx(["success-message", className])}>{successMessage}</p>
      )}
      <form
        method="post"
        className={cx(["profile-form", className])}
        onSubmit={handleSubmit}
      >
        <label className={cx(["profile-label", className])} htmlFor="firstName">
          First Name
        </label>
        <input
          className={cx(["profile-input", className])}
          type="text"
          id="firstName"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label className={cx(["profile-label", className])} htmlFor="lastName">
          Last Name
        </label>
        <input
          className={cx(["profile-input", className])}
          type="text"
          id="lastName"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <label className={cx(["profile-label", className])} htmlFor="email">
          Email
        </label>
        <input
          className={cx(["profile-input", className])}
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className={cx(["profile-button", className])} type="submit">
          Update Profile
        </button>
      </form>
    </>
  );
}
