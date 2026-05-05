import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  GraduationCap,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldOff,
  Menu,
  X,
  Bell,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { loadSettings } from "@/lib/settingsStore";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

interface DashboardShellProps {
  children: ReactNode;
  role: string;
  roleLabel: string;
  navItems: NavItem[];
  userName: string;
  userEmail: string;
}

export function DashboardShell({
  children,
  role,
  roleLabel,
  navItems,
  userName,
  userEmail,
}: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lockedOut, setLockedOut] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string) => {
    if (href === `/${role}`) return location.pathname === `/${role}`;
    return location.pathname.startsWith(href);
  };

  // Close mobile menu and notifications on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  // Load pending parent registration count for admin
  useEffect(() => {
    if (role === "admin") {
      const loadPendingCount = () => {
        const requests = JSON.parse(localStorage.getItem("parent_registration_requests") || "[]");
        const pending = requests.filter((r: any) => r.status === "pending").length;
        setPendingCount(pending);
      };
      loadPendingCount();
      // Listen for storage changes
      window.addEventListener("storage", loadPendingCount);
      return () => window.removeEventListener("storage", loadPendingCount);
    }
  }, [role]);

  // System lockdown guard
  useEffect(() => {
    if (role === "admin" || role === "dod") return;

    const checkLockdown = () => {
      const settings = loadSettings();
      const normalizedRole = role.charAt(0).toUpperCase() + role.slice(1);
      const isUserBlocked = settings.blockedUsers?.includes(userName);
      const isRoleBlocked = settings.blockedRoles?.includes(normalizedRole);

      if (settings.system.systemClosed || isUserBlocked || isRoleBlocked) {
        setLockedOut(true);
        setTimeout(() => {
          localStorage.removeItem("session_user");
          navigate({ to: "/maintenance" });
        }, 2000);
      }
    };

    const onSettingsChanged = () => checkLockdown();
    const interval = setInterval(checkLockdown, 5000);
    window.addEventListener("settings-changed", onSettingsChanged);
    checkLockdown();

    return () => {
      clearInterval(interval);
      window.removeEventListener("settings-changed", onSettingsChanged);
    };
  }, [role, userName, navigate]);

  return (
    <div className="flex min-h-screen bg-background relative overflow-x-hidden">
      {/* Mobile Top Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-border z-[60] flex items-center justify-between px-4 shadow-sm no-print">
        <div className="flex items-center gap-2">
           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-hero-gradient">
             <GraduationCap className="h-4 w-4 text-white" />
           </div>
           <span className="text-base font-bold tracking-tight">Edu<span className="text-primary italic">Pulse</span></span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-surface rounded-xl transition-all"
        >
          {mobileMenuOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Lockout overlay */}
      {lockedOut && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 text-center p-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 border-2 border-red-500/50">
              <ShieldOff className="h-10 w-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">System Closed</h2>
            <p className="text-slate-300 max-w-xs text-sm">
              The administrator has closed the system. Please contact technical support if this is unexpected.
            </p>
          </div>
        </div>
      )}

      {/* Overlay for mobile sidebar */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen border-r border-border bg-sidebar transition-all duration-300 z-[55] no-print
          ${mobileMenuOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? "lg:w-[72px]" : "lg:w-64"}
        `}
      >
        {/* Logo Section */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-hero-gradient shadow-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          {(!collapsed || mobileMenuOpen) && (
            <span className="text-xl font-black tracking-tight text-sidebar-foreground">
              Edu<span className="text-gradient">Pulse</span>
            </span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="mt-4 flex-1 space-y-1.5 px-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all group ${
                  active
                    ? "bg-sidebar-accent text-sidebar-primary font-semibold"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/80 hover:text-sidebar-foreground"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${active ? "text-sidebar-primary" : "group-hover:text-primary transition-colors"}`} />
                {(!collapsed || mobileMenuOpen) && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Controls */}
        <div className="border-t border-sidebar-border p-4 bg-sidebar/50 flex flex-col gap-3">
          {/* Collapse Button - centered */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-10 w-full items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
          
          {/* Logout Button - full width at bottom */}
          <Link
            to="/"
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-black uppercase transition-all shadow-sm
              bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 active:scale-95 border border-red-200/50
            `}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
            {(!collapsed || mobileMenuOpen) && <span>Sign Out</span>}
          </Link>
        </div>
      </aside>

      {/* Content Wrapper */}
      <main className={`flex-1 transition-all duration-300 ease-in-out min-h-screen relative overflow-x-hidden pt-16 lg:pt-0 ${collapsed ? "lg:ml-[72px]" : "lg:ml-64"} ${mobileMenuOpen ? "" : "ml-0"}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-sidebar text-sidebar-foreground"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          
          {/* Right side: Notifications & Profile */}
          <div className="flex items-center gap-4 relative">
            {/* Notification Bell with Badge - Clickable */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {/* Notification Badge */}
                {pendingCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white">
                    {pendingCount > 9 ? '9+' : pendingCount}
                  </span>
                )}
              </button>
              
              {/* Notification Dropdown Panel */}
              {notificationsOpen && role === "admin" && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {pendingCount > 0 ? (
                      <Link 
                        to="/admin/parent-requests"
                        onClick={() => setNotificationsOpen(false)}
                        className="block px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50"
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {pendingCount} pending parent registration{pendingCount > 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Click to review</p>
                      </Link>
                    ) : (
                      <div className="px-4 py-3 text-center text-gray-500 text-sm">
                        No new notifications
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <Link 
                      to="/admin/parent-requests"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View all parent requests
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile Avatar */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{roleLabel}</p>
              </div>
            </div>
          </div>
        </header>
        
        <div className="p-4 md:p-6 lg:p-10 max-w-[1600px] mx-auto layout-container">
          {children}
        </div>
      </main>
    </div>
  );
}
