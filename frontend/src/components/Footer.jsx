import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import Logo from "./Logo";

const Footer = () => (
  <footer className="border-t border-border bg-surface">
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <Logo />
        <p className="mt-4 text-sm text-text-muted">
          Connecting candidates with employers who are actually hiring.
        </p>
      </div>

      <div>
        <h4 className="font-display text-sm font-semibold text-text">For Candidates</h4>
        <ul className="mt-4 space-y-2 text-sm text-text-muted">
          <li><Link to="/jobs" className="hover:text-accent">Browse jobs</Link></li>
          <li><Link to="/register?role=candidate" className="hover:text-accent">Create profile</Link></li>
          <li><Link to="/candidate/dashboard" className="hover:text-accent">Dashboard</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-display text-sm font-semibold text-text">For Employers</h4>
        <ul className="mt-4 space-y-2 text-sm text-text-muted">
          <li><Link to="/register?role=employer" className="hover:text-accent">Post a job</Link></li>
          <li><Link to="/employer/dashboard" className="hover:text-accent">Employer dashboard</Link></li>
          <li><Link to="/blog" className="hover:text-accent">Blog</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-display text-sm font-semibold text-text">Get in touch</h4>
        <ul className="mt-4 space-y-3 text-sm text-text-muted">
          <li className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-accent" strokeWidth={1.75} /> +91 123 456 7890
          </li>
          <li className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-accent" strokeWidth={1.75} /> support@jobtrix.com
          </li>
          <li className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
            Indore, Madhya Pradesh, India
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-border py-5 text-center text-xs text-text-faint">
      © {new Date().getFullYear()} Jobtrix. All rights reserved.
    </div>
  </footer>
);

export default Footer;
