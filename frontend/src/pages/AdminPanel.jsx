import { useCallback, useEffect, useState } from "react";
import { FaSyncAlt, FaTimes, FaExternalLinkAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";
import AuthImage from "../components/AuthImage";
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  STATUS_STYLES,
} from "../constants/complaint";

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full ${
      STATUS_STYLES[status] || "bg-gray-100 text-gray-600"
    }`}
  >
    {STATUS_LABELS[status] || status}
  </span>
);

const formatDate = (d) =>
  new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

const STAT_CARDS = [
  { key: "total", label: "Total" },
  { key: "submitted", label: "Submitted" },
  { key: "in_progress", label: "In progress" },
  { key: "resolved", label: "Resolved" },
  { key: "rejected", label: "Rejected" },
];

/* ---------- detail popup ---------- */
const ComplaintModal = ({ complaint, token, onClose, onSaved }) => {
  const [status, setStatus] = useState(complaint.status);
  const [note, setNote] = useState(complaint.adminNote || "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [lng, lat] = complaint.location.coordinates;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const save = async () => {
    setSaving(true);
    setErr("");
    try {
      const data = await apiRequest(`/admin/complaints/${complaint._id}/status`, {
        token,
        method: "PATCH",
        body: { status, adminNote: note },
      });
      onSaved(data.complaint);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const bbox = `${(lng - 0.004).toFixed(6)},${(lat - 0.003).toFixed(6)},${(lng + 0.004).toFixed(6)},${(lat + 0.003).toFixed(6)}`;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.toFixed(6)},${lng.toFixed(6)}`;
  const mapsLink = `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 overflow-y-auto p-3 sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl max-w-4xl mx-auto grid md:grid-cols-2 overflow-hidden">
        <div className="bg-gray-50 p-4 space-y-3">
          <AuthImage
            complaintId={complaint._id}
            alt={CATEGORY_LABELS[complaint.category]}
            className="w-full rounded-2xl object-cover aspect-[4/3]"
          />
          <iframe
            title="Complaint location"
            src={mapSrc}
            className="w-full h-48 rounded-2xl border border-gray-200 bg-gray-200"
            loading="lazy"
          />
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {CATEGORY_LABELS[complaint.category] || complaint.category}
              </h2>
              <div className="mt-1">
                <StatusBadge status={complaint.status} />
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center"
            >
              <FaTimes />
            </button>
          </div>

          <dl className="text-sm text-gray-600 space-y-2.5">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">AI confidence</dt>
              <dd>{complaint.aiConfidence}%</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Reported by</dt>
              <dd>
                {complaint.user?.name || "Unknown"}
                {complaint.user?.email ? ` (${complaint.user.email})` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Reported on</dt>
              <dd>{formatDate(complaint.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Address</dt>
              <dd>{complaint.address || "Not available"}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Precise location</dt>
              <dd className="font-mono">
                {lat.toFixed(6)}, {lng.toFixed(6)}
                {complaint.accuracy != null && ` (±${complaint.accuracy} m)`}
              </dd>
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-1 text-brand-green font-semibold hover:underline"
              >
                Open in Google Maps <FaExternalLinkAlt className="text-[10px]" />
              </a>
            </div>
            {complaint.description && (
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Description</dt>
                <dd className="whitespace-pre-wrap break-words">{complaint.description}</dd>
              </div>
            )}
          </dl>

          <div className="mt-5 pt-5 border-t border-gray-100">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
              Update status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-green"
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={300}
              rows={2}
              placeholder="Note for this complaint (optional)"
              className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-green"
            />

            {err && <p className="mt-2 text-sm text-red-600">{err}</p>}

            <button
              onClick={save}
              disabled={saving}
              className="mt-3 w-full min-h-[46px] rounded-xl bg-brand-green text-white font-semibold text-sm hover:bg-brand-green/90 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- the panel ---------- */
const AdminPanel = () => {
  const { token } = useAuth();

  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams({ page: String(page), limit: "12" });
      if (status) qs.set("status", status);
      if (category) qs.set("category", category);

      const [list, s] = await Promise.all([
        apiRequest(`/admin/complaints?${qs}`, { token }),
        apiRequest("/admin/stats", { token }),
      ]);
      setItems(list.items);
      setPages(list.pages);
      setStats(s);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, page, status, category]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaved = (updated) => {
    setSelected(null);
    load();
    return updated;
  };

  return (
    <section className="bg-brand-green/10 min-h-[calc(100vh-72px)] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin panel</h1>
            <p className="text-sm text-gray-500">
              All complaints with photo and exact location.
            </p>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-2 text-sm font-semibold text-brand-green bg-white border border-gray-200 rounded-full px-4 py-2 hover:bg-brand-green/5"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {/* stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {STAT_CARDS.map((c) => (
            <div key={c.key} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-brand-green">{stats ? stats[c.key] : "-"}</p>
              <p className="text-xs text-gray-500">{c.label}</p>
            </div>
          ))}
        </div>

        {/* filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
          >
            <option value="">All statuses</option>
            {Object.entries(STATUS_LABELS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
          >
            <option value="">All categories</option>
            {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3">
            {error}
          </div>
        )}

        {/* complaints */}
        {!loading && !error && items.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-sm text-gray-500">
            No complaints found.
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((c) => {
            const [lng, lat] = c.location.coordinates;
            return (
              <button
                key={c._id}
                onClick={() => setSelected(c)}
                className="text-left bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition"
              >
                <AuthImage
                  complaintId={c._id}
                  alt={CATEGORY_LABELS[c.category]}
                  className="w-full h-36 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-gray-900">
                      {CATEGORY_LABELS[c.category] || c.category}
                    </span>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-xs text-gray-500 truncate">{c.address || c.city || "Address not available"}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {lat.toFixed(4)}, {lng.toFixed(4)}
                    {c.accuracy != null && ` · ±${c.accuracy} m`}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">{formatDate(c.createdAt)}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8 text-sm">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-full border border-gray-300 bg-white disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-gray-500">
              Page {page} of {pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, pages))}
              disabled={page === pages}
              className="px-4 py-2 rounded-full border border-gray-300 bg-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {selected && (
        <ComplaintModal
          complaint={selected}
          token={token}
          onClose={() => setSelected(null)}
          onSaved={handleSaved}
        />
      )}
    </section>
  );
};

export default AdminPanel;