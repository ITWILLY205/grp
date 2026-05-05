import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Eye, EyeOff, ArrowRight, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { logLogin, logFailedLogin } from "@/utils/auditLog";
import { loadSettings } from "@/lib/settingsStore";
import { useEffect } from "react";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/login-staff")({
  head: () => ({
    meta: [
      { title: "Staff Login — SMS" },
    ],
  }),
  component: StaffLoginPage,
});

function StaffLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    try {
      const response = await authApi.login({ username, password });
      const { success, user, message } = response.data;

      if (success) {
        toast.success(`Welcome back, ${user.full_name}!`);
        // Navigate based on role
        if (user.role === "ADMIN") navigate({ to: "/admin" });
        else if (user.role === "TEACHER") navigate({ to: "/teacher" });
        else if (user.role === "DISCIPLINE_MASTER") navigate({ to: "/discipline-master" });
        else navigate({ to: "/" });
      } else {
        setLoginError(message || "Invalid credentials");
      }
    } catch (error: any) {
      setLoginError(error.response?.data?.message || "Failed to connect to backend server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: string) => {
    const settings = loadSettings();
    const normalizedRole = role.charAt(0).toUpperCase() + role.slice(1);
    
    if (role === "teacher" && (settings.system.systemClosed || settings.blockedRoles.includes("Teacher"))) {
      setLoginError("Teacher portal is currently closed or restricted.");
      return;
    }

    navigate({ to: `/${role}` as "/" });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden w-1/2 items-center justify-center bg-hero-gradient lg:flex">
        <div className="max-w-md px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold leading-tight text-white">
              Staff Portal
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              Access your administrative and teaching dashboard securely.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-hero-gradient">
                 <Shield className="h-5 w-5 text-primary-foreground" />
               </div>
               <span className="text-xl font-bold">Staff Login</span>
             </div>
             <Link to="/login" className="text-sm text-primary hover:underline font-medium">Back to Portals</Link>
          </div>

          <p className="mt-2 text-sm text-muted-foreground mb-6">
            Sign in to your Staff Account.
          </p>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-input bg-card px-4 py-2.5 pr-10 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`mt-6 group flex w-full items-center justify-center gap-2 rounded-xl bg-hero-gradient px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:glow-primary ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Authenticating..." : "Sign In"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground text-center">
              Quick Demo Access (Dev Only)
            </p>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => handleDemoLogin("teacher")} className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-surface text-center">Teacher</button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
