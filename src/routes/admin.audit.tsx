import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, DataTable } from "@/components/dashboard/SharedUI";
import { getLogs } from "@/utils/auditLog";
import { useState, useEffect } from "react";
import { Search, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/audit")({
  component: AdminAudit,
});

const ACTION_COLORS: Record<string, string> = {
  LOGIN: "bg-green-100 text-green-700",
  LOGOUT: "bg-gray-100 text-gray-600",
  FAILED_LOGIN: "bg-red-100 text-red-700",
  CREATE: "bg-blue-100 text-blue-700",
  UPDATE: "bg-yellow-100 text-yellow-700",
  DELETE: "bg-red-100 text-red-700",
  GRADE: "bg-purple-100 text-purple-700",
  EXPORT: "bg-indigo-100 text-indigo-700",
  GENERATE: "bg-teal-100 text-teal-700",
  ASSIGN: "bg-orange-100 text-orange-700",
};

function formatTimestamp(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  } catch {
    return iso;
  }
}

function AdminAudit() {
  const [logs, setLogs] = useState(getLogs());
  const [search, setSearch] = useState("");
  const [filterModule, setFilterModule] = useState("");

  // Refresh every time page mounts
  useEffect(() => {
    setLogs(getLogs().reverse()); // newest first
  }, []);

  const modules = Array.from(new Set(logs.map(l => l.module)));

  const filtered = logs.filter(l => {
    const matchSearch =
      !search ||
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.module.toLowerCase().includes(search.toLowerCase());
    const matchModule = !filterModule || l.module === filterModule;
    return matchSearch && matchModule;
  });

  const handleClear = () => {
    if (window.confirm("Clear ALL audit logs? This cannot be undone.")) {
      localStorage.removeItem("scholar_sphere_audit_logs");
      setLogs([]);
    }
  };

  return (
    <div>
      <PageHeader
        title="Audit Log"
        description="Real-time tracking of all system actions for transparency and accountability"
        action={
          <button
            onClick={handleClear}
            className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Clear All Logs
          </button>
        }
      />

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user, action, or target..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterModule}
          onChange={e => setFilterModule(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Modules</option>
          {modules.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <span className="text-xs text-gray-500 font-medium bg-gray-100 px-3 py-2 rounded-xl">
          {filtered.length} log{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-16 text-center">
          <p className="text-gray-400 text-sm font-medium">
            {logs.length === 0
              ? "No activity logged yet. Logs will appear here as users interact with the system."
              : "No logs match your search filters."}
          </p>
        </div>
      ) : (
        <DataTable headers={["Timestamp", "User", "Role", "Action", "Module", "Target", "Status"]}>
          {filtered.map((l) => (
            <tr key={l.id} className="hover:bg-surface/50">
              <td className="px-5 py-3.5 text-xs font-mono text-muted-foreground whitespace-nowrap">
                {formatTimestamp(l.timestamp)}
              </td>
              <td className="px-5 py-3.5 text-sm font-semibold">{l.user}</td>
              <td className="px-5 py-3.5">
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {l.role}
                </span>
              </td>
              <td className="px-5 py-3.5">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ACTION_COLORS[l.action] || "bg-gray-100 text-gray-600"}`}>
                  {l.action}
                </span>
              </td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground">{l.module}</td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground max-w-[200px] truncate" title={l.target}>
                {l.target}
              </td>
              <td className="px-5 py-3.5">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${l.status === "SUCCESS" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  {l.status}
                </span>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}
