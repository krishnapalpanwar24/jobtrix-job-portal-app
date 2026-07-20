import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

// We don't store the JWT here (it lives in an httpOnly cookie, unreachable from JS).
// We only keep non-sensitive display info (name, role, id) in localStorage so the UI
// knows who's "logged in" across refreshes, and re-verify against the backend on load.
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("jobtrix_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const endpoint =
          user.role === "candidate"
            ? "/user/getprofile"
            : user.role === "employer"
            ? "/employer/profile"
            : "/admin/dashboard-stats";
        await api.get(endpoint);
      } catch {
        // cookie expired/invalid — clear stale local state
        setUser(null);
        localStorage.removeItem("jobtrix_user");
      } finally {
        setLoading(false);
      }
    };
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("jobtrix_user", JSON.stringify(userData));
  };

  const logout = async () => {
    const endpoint =
      user?.role === "candidate"
        ? "/user/logout"
        : user?.role === "employer"
        ? "/employer/logout"
        : "/admin/logout";
    try {
      await api.post(endpoint);
    } catch {
      // ignore — clear local state regardless
    }
    setUser(null);
    localStorage.removeItem("jobtrix_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
