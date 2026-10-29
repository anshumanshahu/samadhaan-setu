import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCheck,
  FaTimes,
  FaSyncAlt,
  FaPlus,
  FaChevronDown,
  FaRoad,
  FaTrash,
  FaTint,
  FaDotCircle,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";
import AuthImage from "../components/AuthImage";
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  STATUS_STYLES,
} from "../constants/complaint";

const CATEGORY_ICONS = {
  garbage: <FaTrash />,
  pothole: <FaRoad />,
  manhole: <FaDotCircle />,
  water_leak: <FaTint />,
};

const FLOW = ["submitted", "in_progress", "resolved"];

const refId = (c) => `SS-${c._id.slice(-6).toUpperCase()}`;

const formatDate = (d) =>
  new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

// Older complaints may have no history: build a sensible one from what we have
function getTimeline(c) {
  const list = [...(c.statusHistory || [])];
  if (list.length === 0 && c.status !== "submitted") {
    list.push({ status: c.status, at: c.updatedAt, note: c.adminNote });
  }
  if (list[0]?.status !== "submitted") {
    list.unshift({ status: "submitted", at: c.createdAt });
  }
  return list.reverse(); // newest first
}

/* ---------- progress bar ---------- */
const Stepper = ({ status }) => {
  const rejected = status === "rejected";
  const steps = rejected ? ["submitted", "rejected"] : FLOW;
  const current = steps.indexOf(status);

  return (
    <ol className="flex items-start w-full my-5">
      {steps.map((s, i) => {
        const state =
          i < current
            ? "done"
            : i === current
            ? s === "resolved"
              ? "done"
              : s === "rejected"
              ? "bad"
              : "active"
            : "todo";

        const circle = {
          done: "bg-brand-green text-white",
          active: "bg-white border-2 border-brand-green text-brand-green ring-4 ring-brand-green/15",
          bad: "bg-red-500 text-white",
          todo: "bg-gray-100 text-gray-400",
        }[state];

        const line =
          i === 0
            ? ""
            : i <= current
            ? rejected && i === current
              ? "bg-red-300"
              : "bg-brand-green"
            : "bg-gray-200";

        return (
          <li key={s} className="flex-1 relative flex flex-col items-center">
            {i > 0 && <span className={`absolute top-4 right-1/2 w-full h-0.5 ${line}`} />}
            <span className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${circle}`}>
              {state === "done" ? <FaCheck /> : state === "bad" ? <FaTimes /> : i + 1}
            </span>
            <span
              className={`mt-2 text-[11px] text-center ${
                state === "todo" ? "text-gray-400" : "text-gray-900 font-semibold"
              }`}
            >
              {STATUS_LABELS[s]}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

/* ---------- one complaint ---------- */
const ComplaintCard = ({ c, open, onToggle }) => {
  const [lng, lat] = c.location.coordinates;
  const timeline = getTimeline(c);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 sm:gap-4 p-4 text-left hover:bg-gray-50 transition"
      >
        <span className="shrink-0 w-11 h-11 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center text-lg">
          {CATEGORY_ICONS[c.category]}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block font-semibold text-gray-900">
            {CATEGORY_LABELS[c.category] || c.category}
          </span>
          <span className="block text-xs text-gray-500 truncate">
            {refId(c)} · {formatDate(c.createdAt)}
          </span>
        </span>
        <span className={`shrink-0 text-[11px] font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[c.status] || ""}`}>
          {STATUS_LABELS[c.status] || c.status}
        </span>
        <FaChevronDown className={`shrink-0 text-gray-400 text-xs transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-4 sm:px-6 pb-6 border-t border-gray-100">
          <Stepper status={c.status} />

          {c.adminNote && (
            <div className="mb-4 rounded-xl bg-green-50 border border-green-100 text-green-800 text-sm px-4 py-3">
              <span className="font-semibold">Update from the administration: </span>
              {c.adminNote}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <AuthImage
                complaintId={c._id}
                alt={CATEGORY_LABELS[c.category]}
                className="w-full rounded-xl object-cover aspect-[4/3]"
              />
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Location</p>
              <p className="text-sm text-gray-600">{c.address || "Address not available"}</p>
              <p className="text-xs font-mono text-gray-500 mt-1">
                {lat.toFixed(6)}, {lng.toFixed(6)}
                {c.accuracy != null && ` (±${c.accuracy} m)`}
              </p>
              {c.description && (
                <>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Your description</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap break-words">{c.description}</p>
                </>
              )}
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-3">Progress</p>
              <ul className="border-l-2 border-gray-200 ml-1.5 pl-5 space-y-4">
                {timeline.map((t, i) => (
                  <li key={i} className="relative">
                    <span
                      className={`absolute -left-[27px] top-1 w-3 h-3 rounded-full ${
                        t.status === "rejected" ? "bg-red-500" : "bg-brand-green"
                      }`}
                    />
                    <p className="text-sm font-semibold text-gray-900">{STATUS_LABELS[t.status] || t.status}</p>
                    <p className="text-xs text-gray-400">{formatDate(t.at)}</p>
                    {t.note && <p className="text-sm text-gray-600 mt-1">{t.note}</p>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- page ---------- */
const TrackStatus = () => {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      setError("");
      try {
        const data = await apiRequest("/complaints/mine", { token });
        setItems(data.items);
      } catch (err) {
        setError(err.message);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [token]
  );

  // load once, then quietly refresh every 30 seconds so admin updates show up
  useEffect(() => {
    load();
    const timer = setInterval(() => load(true), 30000);
    return () => clearInterval(timer);
  }, [load]);

  const counts = items.reduce(
    (acc, c) => ({ ...acc, [c.status]: (acc[c.status] || 0) + 1 }),
    {}
  );

  const q = query.trim().toLowerCase();
  const visible = items.filter(
    (c) =>
      (filter === "all" || c.status === filter) &&
      (!q || refId(c).toLowerCase().includes(q) || c._id.toLowerCase().includes(q))
  );

  return (
    <section className="bg-brand-green/10 min-h-[calc(100vh-72px)] px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Track status</h1>
            <p className="text-sm text-gray-500">
              Follow every complaint you reported until it is resolved.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => load()}
              aria-label="Refresh"
              className="w-10 h-10 rounded-full bg-white border border-gray-200 text-brand-green flex items-center justify-center hover:bg-brand-green/5"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
            </button>
            <Link
              to="/report"
              className="flex items-center gap-2 bg-brand-green text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-brand-green/90"
            >
              <FaPlus className="text-xs" /> Report an issue
            </Link>
          </div>
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by reference ID, e.g. SS-3F9A2C"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15 mb-3"
        />

        <div className="flex flex-wrap gap-2 mb-5">
          {[{ key: "all", label: "All", count: items.length }, ...Object.entries(STATUS_LABELS).map(([key, label]) => ({ key, label, count: counts[key] || 0 }))].map(
            (f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                  filter === f.key
                    ? "bg-brand-green text-white border-brand-green"
                    : "bg-white text-gray-600 border-gray-200 hover:border-brand-green"
                }`}
              >
                {f.label} ({f.count})
              </button>
            )
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3">
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <p className="font-semibold text-gray-900 mb-1">No complaints yet</p>
            <p className="text-sm text-gray-500 mb-5">
              Report your first issue and you can follow it here.
            </p>
            <Link
              to="/report"
              className="inline-flex items-center gap-2 bg-brand-green text-white text-sm font-semibold px-6 py-2.5 rounded-full"
            >
              <FaPlus className="text-xs" /> Report an issue
            </Link>
          </div>
        )}

        {items.length > 0 && visible.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-8">
            No complaint matches your search.
          </p>
        )}

        <div className="space-y-3">
          {visible.map((c) => (
            <ComplaintCard
              key={c._id}
              c={c}
              open={openId === c._id}
              onToggle={() => setOpenId(openId === c._id ? null : c._id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrackStatus;