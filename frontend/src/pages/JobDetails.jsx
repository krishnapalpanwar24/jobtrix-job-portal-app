import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Briefcase, IndianRupee } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applyState, setApplyState] = useState({ loading: false, message: "" });

  useEffect(() => {
    api.get(`/job/${id}`).then((res) => setJob(res.data.data)).catch(() => setJob(null));
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "candidate") {
      setApplyState({ loading: false, message: "Only candidate accounts can apply." });
      return;
    }
    setApplyState({ loading: true, message: "" });
    try {
      await api.post("/application/apply", { jobId: id });
      setApplyState({ loading: false, message: "Applied successfully!" });
    } catch (err) {
      setApplyState({ loading: false, message: err.response?.data?.message || "Could not apply." });
    }
  };

  if (!job) return <div className="mx-auto max-w-3xl px-6 py-16 text-text-muted">Loading...</div>;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{job.category}</p>
      <h1 className="mt-2 font-display text-4xl font-medium text-text">{job.title}</h1>
      <p className="mt-2 text-text-muted">{job.employer?.name || "Company"}</p>

      <div className="mt-6 flex flex-wrap gap-6 border-y border-border py-5 text-sm text-text-muted">
        <span className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-accent" strokeWidth={1.75} />
          {job.location?.city || "Remote"}, {job.location?.state}
        </span>
        <span className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-accent" strokeWidth={1.75} />
          {job.jobType} · {job.experience}
        </span>
        <span className="flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-accent" strokeWidth={1.75} />
          {job.salaryMin?.toLocaleString()} – {job.salaryMax?.toLocaleString()}
        </span>
      </div>

      <div className="mt-8 space-y-3">
        <h2 className="font-display text-lg font-medium text-text">About this role</h2>
        <p className="whitespace-pre-line leading-relaxed text-text-muted">{job.description}</p>
      </div>

      {job.skills?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {job.skills.map((s) => (
            <span key={s} className="rounded-full bg-surface-alt px-3 py-1 text-xs text-text-muted">
              {s}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={handleApply}
        disabled={applyState.loading}
        className="mt-10 rounded-full bg-accent px-8 py-3 text-sm font-medium text-white transition hover:bg-accent-strong disabled:opacity-60"
      >
        {applyState.loading ? "Applying..." : "Apply now"}
      </button>
      {applyState.message && <p className="mt-3 text-sm text-text-muted">{applyState.message}</p>}
    </div>
  );
};

export default JobDetails;
