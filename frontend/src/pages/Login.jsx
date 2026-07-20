import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ROLE_ENDPOINTS = {
  candidate: "/user/login",
  employer: "/employer/login",
  admin: "/admin/login",
};

const Login = () => {
  const [role, setRole] = useState("candidate");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post(ROLE_ENDPOINTS[role], form);
      login({ ...res.data.data, role });
      navigate(role === "candidate" ? "/candidate/dashboard" : role === "employer" ? "/employer/dashboard" : "/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-display text-3xl font-medium text-text">Welcome back</h1>
      <p className="mt-2 text-sm text-text-muted">Log in to continue to Jobtrix.</p>

      <div className="mt-8 flex rounded-full border border-border p-1 text-sm">
        {["candidate", "employer", "admin"].map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`flex-1 rounded-full py-2 capitalize transition ${
              role === r ? "bg-accent text-white" : "text-text-muted hover:text-text"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-xs text-text-muted">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-muted">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-accent py-3 text-sm font-medium text-white transition hover:bg-accent-strong disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      {role !== "admin" && (
        <p className="mt-6 text-center text-sm text-text-muted">
          Don't have an account?{" "}
          <Link to={`/register?role=${role}`} className="text-accent hover:text-accent-strong">
            Sign up
          </Link>
        </p>
      )}
    </div>
  );
};

export default Login;
