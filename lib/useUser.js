import { useApolloClient, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useEffect, useState } from "react";
import { useAuth } from "@faustwp/core";

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    viewer {
      id
      email
      firstName
      lastName
      capabilities
    }
  }
`;

export function useUser() {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);
  const apolloClient = useApolloClient();

  const { data, loading } = useQuery(GET_CURRENT_USER);

  useEffect(() => {
    if (!loading) {
      setIsAuthenticated(data?.viewer !== null);
      setUser(data?.viewer || null);
    }
  }, [data, loading]);

  return {
    isAuthenticated,
    user,
    login,
    logout,
  };
}
