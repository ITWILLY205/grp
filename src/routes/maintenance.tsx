import { createFileRoute, Link } from "@tanstack/react-router";
import { loadSettings } from "@/lib/settingsStore";
import { ShieldOff, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/maintenance")({
  head: () => ({
    meta: [
      { title: "System Unavailable — SMS" },
      { name: "description", content: "System is currently closed for maintenance." },
    ],
  }),
  component: MaintenancePage,
});

function MaintenancePage() {
  const settings = loadSettings();
  const isSystemTotallyClosed = settings.system.systemClosed;
  
  const title = isSystemTotallyClosed ? "System Closed" : "Access Restricted";
  const badgeText = isSystemTotallyClosed ? "Maintenance Mode Active" : "Access Suspended";
  const message = isSystemTotallyClosed 
    ? (settings.system.maintenanceMessage || "The system is currently under maintenance. Please try again later.")
    : "Your account or role has been restricted by the administrator. Please contact the school office for assistance.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      {/* Animated background rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 animate-ping" style={{ animationDuration: "4s" }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/5 animate-ping" style={{ animationDuration: "3s" }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-white/10 animate-ping" style={{ animationDuration: "2s" }} />
      </div>

      <div className="relative z-10 text-center max-w-lg w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-500/20 border-2 border-red-500/40">
            <ShieldOff className="h-12 w-12 text-red-400" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
          {title}
        </h1>
        <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span className="text-sm font-medium text-red-300">{badgeText}</span>
        </div>

        {/* Message */}
        <p className="text-slate-300 text-lg leading-relaxed mb-10 px-4">
          {message}
        </p>

        {/* Divider */}
        <div className="border-t border-white/10 mb-8" />

        {/* Admin bypass note */}
        <p className="text-slate-500 text-sm mb-4">
          Are you an administrator?
        </p>
        <Link
          to="/login-staff"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-all duration-200 hover:border-white/40 backdrop-blur-sm"
        >
          Admin Login →
        </Link>
      </div>
    </div>
  );
}
