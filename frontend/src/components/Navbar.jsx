import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  const dashboardPath =
    user?.role === "candidate"
      ? "/candidate/dashboard"
      : user?.role === "employer"
      ? "/employer/dashboard"
      : "/admin/dashboard";

  const NavLinks = ({ onClick = () => {} }) => (
    <>
      <Link onClick={onClick} to="/jobs" className="text-sm text-text-muted transition hover:text-text">
        Find Jobs
      </Link>
      <Link onClick={onClick} to="/blog" className="text-sm text-text-muted transition hover:text-text">
        Blog
      </Link>
      <Link onClick={onClick} to="/contact" className="text-sm text-text-muted transition hover:text-text">
        Contact
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLinks />
        </div>

        {/* Desktop auth actions */}
        <div className="hidden items-center gap-4 md:flex">
          {!user ? (
            <>
              <Link to="/login" className="text-sm text-text-muted transition hover:text-text">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-strong"
              >
                Get started
              </Link>
            </>
          ) : (
            <>
              <Link to={dashboardPath} className="text-sm text-text-muted transition hover:text-text">
                Dashboard
              </Link>
              <span className="text-sm text-text-faint">Hi, {user.name?.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm text-text-muted transition hover:border-danger hover:text-danger"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                Log out
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg border border-border p-2 text-text md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-surface px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <NavLinks onClick={() => setOpen(false)} />
            <div className="my-2 border-t border-border" />
            {!user ? (
              <>
                <Link onClick={() => setOpen(false)} to="/login" className="text-sm text-text-muted">
                  Log in
                </Link>
                <Link
                  onClick={() => setOpen(false)}
                  to="/register"
                  className="rounded-full bg-accent px-5 py-2.5 text-center text-sm font-medium text-white"
                >
                  Get started
                </Link>
              </>
            ) : (
              <>
                <Link onClick={() => setOpen(false)} to={dashboardPath} className="text-sm text-text-muted">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-danger"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.75} />
                  Log out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
