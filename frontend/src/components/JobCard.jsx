import { Link } from "react-router-dom";
import { MapPin, Briefcase } from "lucide-react";

const JobCard = ({ job }) => {
  const salaryLabel =
    job.salaryMin && job.salaryMax
      ? `₹${(job.salaryMin / 1000).toFixed(0)}k – ₹${(job.salaryMax / 1000).toFixed(0)}k`
      : "Not disclosed";

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="group block rounded-xl border border-border bg-surface p-6 transition hover:border-accent-dim hover:bg-surface-alt"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-medium text-text group-hover:text-accent-strong">
            {job.title}
          </h3>
          <p className="mt-1 text-sm text-text-muted">{job.employer?.name || "Company"}</p>
        </div>
        <span className="shrink-0 rounded-full border border-border px-3 py-1 text-xs font-mono text-text-muted">
          {job.jobType}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-text-faint">
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
          {job.location?.city || "Remote"}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase className="h-3.5 w-3.5" strokeWidth={1.75} />
          {job.experience || "Any experience"}
        </span>
        <span className="font-mono text-accent">{salaryLabel}</span>
      </div>

      {job.skills?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="rounded-full bg-surface-alt px-2.5 py-1 text-xs text-text-muted">
              {skill}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
};

export default JobCard;
