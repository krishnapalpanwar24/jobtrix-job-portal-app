import { useState } from "react";
import api from "../api/axios";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      await api.post("/contact", form);
      setStatus("Message sent — we'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus(err.response?.data?.message || "Could not send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-4xl font-medium text-text">Get in touch</h1>
      <p className="mt-3 text-base text-text-muted">Questions, feedback, or partnership ideas — we read everything.</p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <div>
          <label className="mb-1.5 block text-sm text-text-muted">Name</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-text focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-text-muted">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-text focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-text-muted">Subject</label>
          <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-text focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-text-muted">Message</label>
          <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-text focus:outline-none" />
        </div>

        <button type="submit" disabled={loading}
          className="rounded-full bg-accent px-8 py-3 text-base font-medium text-white transition hover:bg-accent-strong disabled:opacity-60">
          {loading ? "Sending..." : "Send message"}
        </button>
        {status && <p className="text-sm text-text-muted">{status}</p>}
      </form>
    </div>
  );
};

export default Contact;
