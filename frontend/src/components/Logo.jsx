import { Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = ({ className = "" }) => (
  <Link to="/" className={`flex items-center gap-2 ${className}`}>
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white">
      <Briefcase className="h-4.5 w-4.5" strokeWidth={2} />
    </span>
    <span className="font-display text-xl font-semibold tracking-tight text-text">
      Job<span className="text-accent">trix</span>
    </span>
  </Link>
);

export default Logo;
