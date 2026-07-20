import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import api from "../api/axios";
import JobCard from "../components/JobCard";
import { CATEGORY_NAMES } from "../constants/categories";

const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract", "Remote"];

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    category: searchParams.get("category") || "",
    jobType: searchParams.get("jobType") || "",
    city: searchParams.get("city") || "",
  });

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ ...filters, page });
      // strip empty values
      [...params.keys()].forEach((k) => !params.get(k) && params.delete(k));
      const res = await api.get(`/job/all?${params.toString()}`);
      setJobs(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = (e) => {
    e.preventDefault();
    setSearchParams(filters);
    fetchJobs(1);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl font-medium text-text">Browse jobs</h1>

      <form onSubmit={applyFilters} className="mt-8 space-y-4 rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center gap-2 rounded-full border border-border bg-base px-4 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-text-faint" strokeWidth={1.75} />
          <input
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            placeholder="Search title, skill, description..."
            className="w-full bg-transparent text-sm text-text placeholder:text-text-faint focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="rounded-lg border border-border bg-base px-3 py-2 text-sm text-text"
          >
            <option value="">All categories</option>
            {CATEGORY_NAMES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={filters.jobType}
            onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
            className="rounded-lg border border-border bg-base px-3 py-2 text-sm text-text"
          >
            <option value="">All job types</option>
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <input
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            placeholder="City"
            className="w-32 rounded-lg border border-border bg-base px-3 py-2 text-sm text-text placeholder:text-text-faint"
          />

          <button
            type="submit"
            className="ml-auto rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-accent-strong"
          >
            Apply filters
          </button>
        </div>
      </form>

      <div className="mt-8">
        {loading ? (
          <p className="text-text-muted">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-text-muted">No jobs match your filters. Try broadening your search.</p>
        ) : (
          <>
            <p className="mb-4 text-sm text-text-faint">{pagination.total} roles found</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => fetchJobs(p)}
                    className={`h-9 w-9 rounded-full text-sm ${
                      p === pagination.page
                        ? "bg-accent text-white"
                        : "border border-border text-text-muted hover:text-text"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;
