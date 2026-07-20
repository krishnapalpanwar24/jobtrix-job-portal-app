import { useEffect, useState } from "react";
import { User, FileText, ListChecks } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "applications", label: "Applications", icon: ListChecks },
];

const CandidateDashboard = () => {
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [status, setStatus] = useState("");

  const loadProfile = async () => {
    const res = await api.get("/user/getprofile");
    setProfile(res.data.data);
    setForm({
      name: res.data.data.name || "",
      phoneNumber: res.data.data.phoneNumber || "",
      jobTitle: res.data.data.jobTitle || "",
      experience: res.data.data.experience || "",
      skills: (res.data.data.skills || []).join(", "),
      description: res.data.data.description || "",
    });
  };

  const loadApplications = async () => {
    const res = await api.get("/application/my-applications");
    setApplications(res.data.data);
  };

  useEffect(() => {
    loadProfile();
    loadApplications();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (imageFile) data.append("profileImage", imageFile);
    try {
      const res = await api.put("/user/update-personal-info", data);
      setProfile(res.data.data);
      setUser({ ...user, name: res.data.data.name });
      setStatus("Saved!");
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to save");
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;
    setStatus("Uploading...");
    const data = new FormData();
    data.append("resume", resumeFile);
    try {
      const res = await api.put("/user/update-resume", data);
      setProfile(res.data.data);
      setStatus("Resume updated!");
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to upload");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl font-medium text-text">Your dashboard</h1>

      <div className="mt-8 flex gap-2 overflow-x-auto border-b border-border">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition ${
              tab === id ? "border-accent text-text" : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {label}
          </button>
        ))}
      </div>

      {tab === "profile" && profile && (
        <form onSubmit={handleProfileSave} className="mt-8 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full border border-border bg-surface-alt">
              {profile.profileImage?.url && (
                <img src={profile.profileImage.url} alt="Profile" className="h-full w-full object-cover" />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="text-xs text-text-muted"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {["name", "phoneNumber", "jobTitle", "experience"].map((field) => (
              <div key={field}>
                <label className="mb-1 block text-xs capitalize text-text-muted">{field}</label>
                <input
                  value={form[field] || ""}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-xs text-text-muted">Skills (comma separated)</label>
            <input
              value={form.skills || ""}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-text-muted">About you</label>
            <textarea
              rows={4}
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition hover:bg-accent-strong"
          >
            Save changes
          </button>
          {status && <p className="text-sm text-text-muted">{status}</p>}
        </form>
      )}

      {tab === "resume" && (
        <div className="mt-8">
          {profile?.resume?.url ? (
            <a
              href={profile.resume.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg border border-border bg-surface px-4 py-3 text-sm text-accent hover:border-accent-dim"
            >
              View current resume →
            </a>
          ) : (
            <p className="text-sm text-text-muted">No resume uploaded yet.</p>
          )}

          <form onSubmit={handleResumeUpload} className="mt-4 flex items-center gap-3">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="text-xs text-text-muted"
            />
            <button
              type="submit"
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-accent-strong"
            >
              Upload
            </button>
          </form>
          {status && <p className="mt-3 text-sm text-text-muted">{status}</p>}
        </div>
      )}

      {tab === "applications" && (
        <div className="mt-8 space-y-3">
          {applications.length === 0 ? (
            <p className="text-sm text-text-muted">You haven't applied to any jobs yet.</p>
          ) : (
            applications.map((app) => (
              <div key={app._id} className="flex flex-col gap-2 rounded-lg border border-border bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-medium text-text">{app.job?.title}</p>
                  <p className="truncate text-xs text-text-muted">{app.employer?.name}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs capitalize ${
                    app.status === "hired"
                      ? "bg-success/15 text-success"
                      : app.status === "rejected"
                      ? "bg-danger/15 text-danger"
                      : app.status === "shortlisted"
                      ? "bg-accent/15 text-accent"
                      : "bg-surface-alt text-text-muted"
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;
