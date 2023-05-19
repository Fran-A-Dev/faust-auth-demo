import { useLogin } from "@faustwp/core";
import { useState } from "react";

export default function Login() {
  const [usernameEmail, setUsernameEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, data, error } = useLogin();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        login(usernameEmail, password, "/members");
      }}
    >
      <fieldset>
        <label htmlFor="usernameEmail">Username or Email</label>
        <input
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
