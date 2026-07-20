import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft } from "lucide-react";
import { POSTS } from "./Blog";

const BODY = "This is placeholder editorial content for the Jobtrix blog. Swap this section for real articles once your content team has posts ready — the layout, spacing, and typography are already wired up for long-form reading.";

const BlogDetail = () => {
  const { id } = useParams();
  const post = POSTS.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-text-muted">Post not found.</p>
        <Link to="/blog" className="mt-4 inline-block text-accent hover:text-accent-strong">
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link to="/blog" className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-strong">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Back to blog
      </Link>

      <span className="mt-6 flex items-center gap-1.5 text-xs text-text-faint">
        <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
        {post.date}
      </span>
      <h1 className="mt-3 font-display text-3xl font-medium text-text sm:text-4xl">{post.title}</h1>

      <div className="mt-6 aspect-video w-full overflow-hidden rounded-xl bg-surface-alt">
        <img
          src={post.image}
          alt={post.title}
          onError={(e) => (e.currentTarget.style.display = "none")}
          className="h-full w-full object-cover"
        />
      </div>

      <p className="mt-6 leading-relaxed text-text-muted">{post.excerpt}</p>
      <p className="mt-4 leading-relaxed text-text-muted">{BODY}</p>
    </div>
  );
};

export default BlogDetail;
