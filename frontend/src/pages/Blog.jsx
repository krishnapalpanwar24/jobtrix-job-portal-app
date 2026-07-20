import { Link } from "react-router-dom";
import { Calendar, MessageCircle, ArrowRight } from "lucide-react";

const POSTS = [
  {
    id: "resume-tips",
    title: "5 resume tips that actually get you shortlisted",
    date: "July 2, 2026",
    comments: 12,
    image: "/images/blog/newspaper.webp",
    excerpt: "Recruiters spend seconds, not minutes, on a first pass. Here's what makes them stop scrolling.",
  },
  {
    id: "remote-interview",
    title: "How to nail a remote interview",
    date: "June 18, 2026",
    comments: 8,
    image: "/images/blog/sales.webp",
    excerpt: "Lighting, framing, and the follow-up email — the small things that shape a first impression.",
  },
  {
    id: "salary-negotiation",
    title: "Negotiating salary without burning the offer",
    date: "June 4, 2026",
    comments: 15,
    image: "/images/blog/salary.jpg",
    excerpt: "A practical framework for asking for more, backed by research rather than guesswork.",
  },
  {
    id: "hiring-2026",
    title: "What employers are actually screening for in 2026",
    date: "May 22, 2026",
    comments: 6,
    image: "/images/blog/overall.webp",
    excerpt: "Fewer keyword matches, more real signal — how hiring teams are changing how they read applications.",
  },
  {
    id: "resume-tips",
    title: "5 resume tips that actually get you shortlisted",
    date: "July 2, 2026",
    comments: 12,
    image: "/images/blog/newspaper.webp",
    excerpt: "Recruiters spend seconds, not minutes, on a first pass. Here's what makes them stop scrolling.",
  },
  {
    id: "remote-interview",
    title: "How to nail a remote interview",
    date: "June 18, 2026",
    comments: 8,
    image: "/images/blog/sales.webp",
    excerpt: "Lighting, framing, and the follow-up email — the small things that shape a first impression.",
  }
];

const Blog = () => (
  <div className="mx-auto max-w-7xl px-6 py-16">
    <div className="text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Jobtrix journal</p>
      <h1 className="mt-3 font-display text-4xl font-medium text-text">Career advice, actually useful</h1>
      <p className="mt-3 text-text-muted">Short, practical reads for job seekers and hiring teams.</p>
    </div>

    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {POSTS.map((post) => (
        <Link
          key={post.id}
          to={`/blog/${post.id}`}
          className="group overflow-hidden rounded-xl border border-border bg-surface transition hover:border-accent-dim hover:shadow-sm"
        >
          <div className="aspect-video w-full overflow-hidden bg-surface-alt">
            {/* Save thumbnails as public/images/blog/<id>.jpg (recommended: 800x450 each) */}
            <img
              src={post.image}
              alt={post.title}
              onError={(e) => (e.currentTarget.style.display = "none")}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 text-xs text-text-faint">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.75} />
                {post.comments} Comments
              </span>
            </div>
            <h2 className="mt-3 font-display text-xl font-medium text-text group-hover:text-accent">
              {post.title}
            </h2>
            <p className="mt-2 text-sm text-text-muted">{post.excerpt}</p>
            <span className="mt-4 flex items-center gap-1 text-sm font-medium text-accent">
              Read More <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default Blog;
export { POSTS };
