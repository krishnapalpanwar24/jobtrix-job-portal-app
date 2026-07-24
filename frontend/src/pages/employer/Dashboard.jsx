import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Briefcase, Users, Pencil, Trash2, Building2 } from "lucide-react";
import api from "../../api/axios";
import { CATEGORY_NAMES } from "../../constants/categories";

const TABS = [
  { id: "myjobs", label: "My jobs", icon: Briefcase },
  { id: "post", label: "Post a job", icon: PlusCircle },
];

const emptyJob = {
  title: "", description: "", category: "", jobType: "Full-time",
  experience: "", skills: "", salaryMin: "", salaryMax: "", vacancies: 1,
  city: "", state: "", country: "India",
};

const EmployerDashboard = () => {
  const [tab, setTab] = useState("myjobs");
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyJob);
  const [status, setStatus] = useState("");
  const [applicants, setApplicants] = useState(null); // { jobId, list }
  const [editingJobId, setEditingJobId] = useState(null);

  // 🤖 AI Resume Analyzer state
  const [analyzing, setAnalyzing] = useState(null); // holds the app._id currently being analyzed
  const [analysisResults, setAnalysisResults] = useState({}); // { [appId]: result }

  const loadJobs = async () => {
    const res = await api.get("/job/employer/my-jobs");
    setJobs(res.data.data);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    setStatus(editingJobId ? "Updating..." : "Posting...");
    const payload = {
      ...form,
      skills: form.skills,
      location: { city: form.city, state: form.state, country: form.country },
    };
    try {
      if (editingJobId) {
        await api.put(`/job/${editingJobId}`, payload);
        setStatus("Job updated!");
      } else {
        await api.post("/job/create", payload);
        setStatus("Job posted!");
      }
      setForm(emptyJob);
      setEditingJobId(null);
      loadJobs();
      setTab("myjobs");
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to save job");
    }
  };

  const startEdit = (job) => {
    setForm({
      title: job.title || "",
      description: job.description || "",
      category: job.category || "",
      jobType: job.jobType || "Full-time",
      experience: job.experience || "",
      skills: (job.skills || []).join(", "),
      salaryMin: job.salaryMin || "",
      salaryMax: job.salaryMax || "",
      vacancies: job.vacancies || 1,
      city: job.location?.city || "",
      state: job.location?.state || "",
      country: job.location?.country || "India",
    });
    setEditingJobId(job._id);
    setTab("post");
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job? This can't be undone.")) return;
    await api.delete(`/job/${jobId}`);
    loadJobs();
  };

  const viewApplicants = async (jobId) => {
    const res = await api.get(`/application/job/${jobId}`);
    setApplicants({ jobId, list: res.data.data });
    setAnalysisResults({}); // reset previous results when switching jobs
  };

  const updateStatus = async (appId, newStatus) => {
    await api.put(`/application/${appId}/status`, { status: newStatus });
    viewApplicants(applicants.jobId);
  };

  // 🤖 Analyze a candidate's resume against the job description using AI
  const analyzeResume = async (app, jobId) => {
    if (!app.resume?.url) {
      alert("This candidate hasn't uploaded a resume.");
      return;
    }
    setAnalyzing(app._id);
    try {
      const res = await api.post("/resume/analyze", {
        resumeUrl: app.resume.url,
        jobId: jobId,
      });
      setAnalysisResults((prev) => ({ ...prev, [app._id]: res.data.data }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to analyze resume");
    } finally {
      setAnalyzing(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-medium text-text">Employer dashboard</h1>
        <Link
          to="/employer/profile"
          className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs text-text-muted hover:border-accent-dim hover:text-accent"
        >
          <Building2 className="h-3.5 w-3.5" strokeWidth={1.75} />
          Company profile
        </Link>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto border-b border-border">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setTab(id); setApplicants(null); }}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition ${
              tab === id ? "border-accent text-text" : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {label}
          </button>
        ))}
      </div>

      {tab === "myjobs" && !applicants && (
        <div className="mt-8 space-y-3">
          {jobs.length === 0 ? (
            <p className="text-sm text-text-muted">You haven't posted any jobs yet.</p>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="flex flex-col gap-3 rounded-lg border border-border bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-medium text-text">{job.title}</p>
                  <p className="text-xs text-text-muted">{job.category} · {job.jobType} · {job.location?.city}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => startEdit(job)}
                    className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs text-text-muted hover:border-accent-dim hover:text-accent"
                  >
                    <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs text-text-muted hover:border-danger hover:text-danger"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Delete
                  </button>
                  <button
                    onClick={() => viewApplicants(job._id)}
                    className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs text-text-muted hover:border-accent-dim hover:text-accent"
                  >
                    <Users className="h-3.5 w-3.5" strokeWidth={1.75} />
                    View applicants
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {applicants && (
        <div className="mt-8">
          <button onClick={() => setApplicants(null)} className="mb-4 text-sm text-accent hover:text-accent-strong">
            ← Back to jobs
          </button>
          {applicants.list.length === 0 ? (
            <p className="text-sm text-text-muted">No applicants yet for this job.</p>
          ) : (
            <div className="space-y-3">
              {applicants.list.map((app) => (
                <div key={app._id} className="rounded-lg border border-border bg-surface px-5 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-surface-alt">
                        {app.candidate?.profileImage?.url && (
                          <img
                            src={app.candidate.profileImage.url}
                            alt={app.candidate?.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-text">{app.candidate?.name}</p>
                        <p className="truncate text-xs text-text-muted">{app.candidate?.email}</p>
                      </div>
                    </div>

                    {/* 🤖 Resume link + AI Analyze button */}
                    <div className="flex shrink-0 items-center gap-2">
                      {app.resume?.url && (
                        <a
                          href={app.resume.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-accent hover:text-accent-strong"
                        >
                          View resume →
                        </a>
                      )}
                      <button
                        onClick={() => analyzeResume(app, applicants.jobId)}
                        disabled={analyzing === app._id}
                        className="rounded-full border border-border px-3 py-1.5 text-xs text-text-muted hover:border-accent-dim hover:text-accent disabled:opacity-50"
                      >
                        {analyzing === app._id ? "Analyzing..." : "🤖 AI Analyze"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {["applied", "shortlisted", "rejected", "hired"].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(app._id, s)}
                        className={`rounded-full px-3 py-1 text-xs capitalize transition ${
                          app.status === s ? "bg-accent text-white" : "border border-border text-text-muted hover:text-text"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  {/* 🤖 AI Analysis Result */}
                 {analysisResults[app._id] && (
  <div className="mt-3 rounded-lg border border-accent-dim bg-surface-alt px-5 py-4 text-sm leading-relaxed">
    <p className="font-semibold text-text">
      ATS Score:{" "}
      <span className="text-accent">{analysisResults[app._id].atsScore}/100</span>
    </p>
    <p className="mt-2 text-text-muted">
      <span className="font-semibold text-text">Matched skills:</span>{" "}
      {analysisResults[app._id].matchedSkills?.join(", ") || "None"}
    </p>
    <p className="mt-2 text-text-muted">
      <span className="font-semibold text-text">Missing skills:</span>{" "}
      {analysisResults[app._id].missingSkills?.join(", ") || "None"}
    </p>
    <p className="mt-2 text-text-muted">
      <span className="font-semibold text-text">Recommendation:</span>{" "}
      {analysisResults[app._id].recommendation}
    </p>
  </div>
)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "post" && (
        <form onSubmit={handlePost} className="mt-8 max-w-2xl space-y-4">
          <div>
            <label className="mb-1 block text-xs text-text-muted">Job title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-muted">Description</label>
            <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-text-muted">Category</label>
              <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none">
                <option value="">Select category</option>
                {CATEGORY_NAMES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Job type</label>
              <select value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none">
                {["Full-time", "Part-time", "Internship", "Contract", "Remote"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-muted">Skills (comma separated)</label>
            <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-text-muted">Min salary</label>
              <input type="number" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Max salary</label>
              <input type="number" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-muted">City</label>
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none" />
          </div>

          <button type="submit" className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition hover:bg-accent-strong">
            Post job
          </button>
          {status && <p className="text-sm text-text-muted">{status}</p>}
        </form>
      )}
    </div>
  );
};

export default EmployerDashboard;
