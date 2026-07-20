import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight, MapPin } from "lucide-react";
import api from "../api/axios";
import JobCard from "../components/JobCard";
import { CATEGORIES } from "../constants/categories";

const Home = () => {
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [recentJobs, setRecentJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/job/all?limit=6")
      .then((res) => {
        setRecentJobs(res.data.data);
        setTotal(res.data.pagination?.total || 0);
      })
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (city) params.set("city", city);
    navigate(`/jobs${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div>
      {/* Hero — full-bleed banner image with dark overlay */}
      <section className="relative isolate overflow-hidden bg-text">
        
        <img
          src="/images/banner.jpg"
          alt=""
          onError={(e) => (e.currentTarget.style.display = "none")}
          className="absolute inset-0 h-full w-full object-cover"
        />
       
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/60 to-black/75" />

        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
            There are <span className="text-accent">{total.toLocaleString()}+</span> postings here for you!
          </h1>
          <p className="mt-4 max-w-lg text-white/80">
            Find jobs, employment &amp; career opportunities on Jobtrix.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-10 flex max-w-2xl flex-col gap-2 rounded-xl bg-white p-2 shadow-lg sm:flex-row sm:rounded-full"
          >
            <div className="flex flex-1 items-center gap-2 px-4 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-text-faint" strokeWidth={1.75} />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, keywords, or company"
                className="w-full bg-transparent text-sm text-text placeholder:text-text-faint focus:outline-none"
              />
            </div>
            <div className="hidden h-6 w-px self-center bg-border sm:block" />
            <div className="flex flex-1 items-center gap-2 px-4 py-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-text-faint" strokeWidth={1.75} />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Location"
                className="w-full bg-transparent text-sm text-text placeholder:text-text-faint focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-strong"
            >
              Find Jobs
            </button>
          </form>

          <p className="mt-6 text-xs text-white/70">
            Popular searches: <span className="font-medium text-white">Designer, Developer, Web, iOS, PHP, Senior, Engineer</span>
          </p>
        </div>
      </section>

      
      <section className="bg-surface-alt">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-16 sm:grid-cols-2 sm:py-20">
          <div className="overflow-hidden rounded-2xl bg-surface">
           
            <img
              src="/images/millions.jpg"
              alt="Person searching for jobs on a laptop"
              onError={(e) => (e.currentTarget.style.display = "none")}
              className="aspect-square w-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold leading-tight text-text sm:text-4xl">
              Millions of Jobs. Find the one that suits you.
            </h2>
            <p className="mt-4 text-text-muted">
              Search all the open positions on the web. Get your own personalized job
              matches and track every application in one place.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Thousands of new jobs added every week",
                "Filter by role, location, salary, and experience",
                "Apply in a click and track your status live",
              ].map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm text-text">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                    ✓
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <Link
              to="/register?role=candidate"
              className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-strong"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

     
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <h2 className="font-display text-2xl font-medium text-text sm:text-3xl">Popular Job Categories</h2>
          <p className="mt-2 text-sm text-text-muted">Browse jobs by what you're good at.</p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/jobs?category=${encodeURIComponent(cat.name)}`}
              className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-6 text-center transition hover:border-accent-dim hover:shadow-sm"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-sm font-medium text-text">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent jobs */}
      <section className="border-t border-border bg-surface-alt">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-medium text-text sm:text-3xl">Featured Jobs</h2>
            <Link to="/jobs" className="flex items-center gap-1 text-sm text-accent hover:text-accent-strong">
              View all <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <p className="mt-8 text-text-muted">No jobs posted yet — check back soon.</p>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-8 rounded-2xl border border-border bg-surface p-10 text-center sm:grid-cols-3">
          {[
            ["4M+", "Daily active users"],
            [`${total || 0}+`, "Open job positions"],
            ["20M+", "Stories shared"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="font-display text-3xl font-semibold text-accent sm:text-4xl">{value}</p>
              <p className="mt-1 text-sm text-text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA split */}
      <section className="mx-auto mb-16 max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border sm:grid-cols-2">
          <div className="bg-surface p-10">
            <h3 className="font-display text-xl font-medium text-text">Looking for work?</h3>
            <p className="mt-2 text-sm text-text-muted">
              Build a profile once, apply everywhere, track every application in one place.
            </p>
            <Link
              to="/register?role=candidate"
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-strong"
            >
              Create a candidate account <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Link>
          </div>
          <div className="bg-accent-dim p-10">
            <h3 className="font-display text-xl font-medium text-text">Hiring?</h3>
            <p className="mt-2 text-sm text-text-muted">
              Post a role in minutes and manage applicants without the spreadsheet chaos.
            </p>
            <Link
              to="/register?role=employer"
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent-strong hover:text-accent"
            >
              Post your first job <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
