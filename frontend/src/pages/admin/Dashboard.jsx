import { useEffect, useState } from "react";
import { LayoutDashboard, Users, Building2, Briefcase } from "lucide-react";
import api from "../../api/axios";

const TABS = [
  { id: "stats", label: "Overview", icon: LayoutDashboard },
  { id: "candidates", label: "Candidates", icon: Users },
  { id: "employers", label: "Employers", icon: Building2 },
  { id: "jobs", label: "Jobs", icon: Briefcase },
];

const AdminDashboard = () => {
  const [tab, setTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [jobs, setJobs] = useState([]);

  const loadStats = async () => setStats((await api.get("/admin/dashboard-stats")).data.data);
  const loadCandidates = async () => setCandidates((await api.get("/admin/candidates")).data.data);
  const loadEmployers = async () => setEmployers((await api.get("/admin/employers")).data.data);
  const loadJobs = async () => setJobs((await api.get("/admin/jobs")).data.data);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (tab === "candidates") loadCandidates();
    if (tab === "employers") loadEmployers();
    if (tab === "jobs") loadJobs();
  }, [tab]);

  const toggleBlock = async (type, id) => {
    await api.put(`/admin/${type}/${id}/toggle-block`);
    if (type === "candidates") loadCandidates();
    if (type === "employers") loadEmployers();
    if (type === "jobs") loadJobs();
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-3xl font-medium text-text">Admin panel</h1>

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

      {tab === "stats" && stats && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["Candidates", stats.totalCandidates],
            ["Employers", stats.totalEmployers],
            ["Jobs", stats.totalJobs],
            ["Applications", stats.totalApplications],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-border bg-surface p-6">
              <p className="font-display text-3xl font-medium text-accent">{value}</p>
              <p className="mt-1 text-sm text-text-muted">{label}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "candidates" && (
        <div className="mt-8 space-y-2">
          {candidates.map((c) => (
            <div key={c._id} className="flex flex-col gap-2 rounded-lg border border-border bg-surface px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text">{c.name}</p>
                <p className="text-xs text-text-muted">{c.email}</p>
              </div>
              <button
                onClick={() => toggleBlock("candidates", c._id)}
                className={`rounded-full px-3 py-1 text-xs ${c.isBlocked ? "bg-danger/15 text-danger" : "border border-border text-text-muted hover:text-text"}`}
              >
                {c.isBlocked ? "Blocked — unblock" : "Block"}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "employers" && (
        <div className="mt-8 space-y-2">
          {employers.map((emp) => (
            <div key={emp._id} className="flex flex-col gap-2 rounded-lg border border-border bg-surface px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text">{emp.name}</p>
                <p className="text-xs text-text-muted">{emp.email}</p>
              </div>
              <button
                onClick={() => toggleBlock("employers", emp._id)}
                className={`rounded-full px-3 py-1 text-xs ${emp.isBlocked ? "bg-danger/15 text-danger" : "border border-border text-text-muted hover:text-text"}`}
              >
                {emp.isBlocked ? "Blocked — unblock" : "Block"}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "jobs" && (
        <div className="mt-8 space-y-2">
          {jobs.map((job) => (
            <div key={job._id} className="flex flex-col gap-2 rounded-lg border border-border bg-surface px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text">{job.title}</p>
                <p className="text-xs text-text-muted">{job.employer?.name}</p>
              </div>
              <button
                onClick={() => toggleBlock("jobs", job._id)}
                className={`rounded-full px-3 py-1 text-xs ${job.isBlocked ? "bg-danger/15 text-danger" : "border border-border text-text-muted hover:text-text"}`}
              >
                {job.isBlocked ? "Blocked — unblock" : "Block"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
