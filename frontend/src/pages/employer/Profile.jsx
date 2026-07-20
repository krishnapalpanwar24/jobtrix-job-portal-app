import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const EmployerProfile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [status, setStatus] = useState("");

  const load = async () => {
    const res = await api.get("/employer/profile");
    setProfile(res.data.data);
    setForm({
      name: res.data.data.name || "",
      phoneNumber: res.data.data.phoneNumber || "",
      website: res.data.data.website || "",
      industryType: res.data.data.industryType || "",
      category: res.data.data.category || "",
      foundedIn: res.data.data.foundedIn || "",
      teamSize: res.data.data.teamSize || "",
      about: res.data.data.about || "",
    });
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (logoFile) data.append("logo", logoFile);
    if (coverFile) data.append("coverImage", coverFile);
    try {
      const res = await api.put("/employer/update", data);
      setProfile(res.data.data);
      setUser({ ...user, name: res.data.data.name });
      setStatus("Saved!");
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to save");
    }
  };

  if (!profile) return <div className="mx-auto max-w-3xl px-6 py-16 text-text-muted">Loading...</div>;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl font-medium text-text">Company profile</h1>
      <p className="mt-2 text-sm text-text-muted">This is what candidates see about your company.</p>

      {/* Cover preview */}
      <div className="mt-8 h-32 w-full overflow-hidden rounded-xl border border-border bg-surface-alt">
        {profile.coverImage?.url && (
          <img src={profile.coverImage.url} alt="Cover" className="h-full w-full object-cover" />
        )}
      </div>

      <div className="-mt-10 ml-6 h-20 w-20 overflow-hidden rounded-full border-4 border-base bg-surface-alt">
        {profile.image?.url && <img src={profile.image.url} alt="Logo" className="h-full w-full object-cover" />}
      </div>

      <form onSubmit={handleSave} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-text-muted">Logo</label>
            <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} className="text-xs text-text-muted" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-muted">Cover image</label>
            <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} className="text-xs text-text-muted" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-text-muted">Company name</label>
          <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-text-muted">Phone number</label>
            <input value={form.phoneNumber || ""} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-muted">Website</label>
            <input value={form.website || ""} onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-text-muted">Industry type</label>
            <input value={form.industryType || ""} onChange={(e) => setForm({ ...form, industryType: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-muted">Category</label>
            <input value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-text-muted">Founded in</label>
            <input value={form.foundedIn || ""} onChange={(e) => setForm({ ...form, foundedIn: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-muted">Team size</label>
            <input value={form.teamSize || ""} onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-text-muted">About the company</label>
          <textarea rows={4} value={form.about || ""} onChange={(e) => setForm({ ...form, about: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text focus:outline-none" />
        </div>

        <button type="submit" className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition hover:bg-accent-strong">
          Save changes
        </button>
        {status && <p className="text-sm text-text-muted">{status}</p>}
      </form>
    </div>
  );
};

export default EmployerProfile;
