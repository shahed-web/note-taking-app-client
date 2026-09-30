import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate("/notes", { replace: true });
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <h1>Secure Notes</h1>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link> 
      </p>
    </main>
  );
}

export default Login;