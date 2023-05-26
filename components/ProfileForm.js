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

export default function Page(props) {
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
      {successMessage && <p>{successMessage}</p>}
      <form method="post" onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Update Profile</button>
      </form>
    </>
  );
}
