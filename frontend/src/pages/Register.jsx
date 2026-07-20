import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get("role") === "employer" ? "employer" : "candidate");
  const [form, setForm] = useState({ name: "", email: "", password: "", phoneNumber: "", industryType: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = role === "candidate" ? "/user/register" : "/employer/register";
      await api.post(endpoint, form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-display text-3xl font-medium text-text">Create your account</h1>
      <p className="mt-2 text-sm text-text-muted">Join Jobtrix as a candidate or employer.</p>

      <div className="mt-8 flex rounded-full border border-border p-1 text-sm">
        {["candidate", "employer"].map((r) => (
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

      {success ? (
        <p className="mt-8 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          Account created! Redirecting to login...
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs text-text-muted">{role === "candidate" ? "Full name" : "Company name"}</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none"
            />
          </div>
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
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none"
            />
          </div>

          {role === "employer" && (
            <>
              <div>
                <label className="mb-1 block text-xs text-text-muted">Phone number</label>
                <input
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-text-muted">Industry type</label>
                <input
                  value={form.industryType}
                  onChange={(e) => setForm({ ...form, industryType: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none"
                />
              </div>
            </>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-accent py-3 text-sm font-medium text-white transition hover:bg-accent-strong disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-accent hover:text-accent-strong">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;
