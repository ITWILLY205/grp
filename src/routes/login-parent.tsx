import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { GraduationCap, ArrowRight, UserCircle, User, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { logLogin, logFailedLogin } from "@/utils/auditLog";
import { authApi } from "@/lib/api";
import { loadSettings } from "@/lib/settingsStore";

export const Route = createFileRoute("/login-parent")({
  head: () => ({
    meta: [
      { title: "Parent Login — SMS" },
    ],
  }),
  component: ParentLoginPage,
});

function ParentLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Maintenance guard — block access when system is closed
  useEffect(() => {
    const settings = loadSettings();
    if (settings.system.systemClosed || settings.blockedRoles.includes("Parent")) {
      navigate({ to: "/maintenance" });
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await authApi.login({ username, password });

      if (response.data.success && response.data.user.role === 'PARENT') {
        const user = response.data.user;
        const settings = loadSettings();

        if (settings.blockedUsers.includes(user.full_name)) {
          setLoginError("Your parent account has been blocked by the administrator.");
          logFailedLogin(user.full_name, "Attempted parent login while blocked");
          return;
        }

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem("session_user", JSON.stringify({ role: "parent", id: user.id, name: user.full_name }));
        logLogin(user.full_name, username, "parent", { loginMethod: "username_password" });
        navigate({ to: "/parent" });
      } else if (response.data.success) {
        setLoginError("Access Denied: This account is not a Parent account.");
      }
    } catch (error: any) {
      const msg = error?.response?.data?.error || error?.response?.data?.message || "Invalid username or password.";
      setLoginError(msg);
      logFailedLogin(username || "unknown", "Invalid parent credentials");
    }
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
              <UserCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold leading-tight text-white">
              Parent Portal
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              Stay up to date with your child's academic performance, discipline, and attendance.
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
                 <UserCircle className="h-5 w-5 text-primary-foreground" />
               </div>
               <span className="text-xl font-bold">Parent Login</span>
             </div>
             <Link to="/login" className="text-sm text-primary hover:underline font-medium">Back to Portals</Link>
          </div>

          <p className="mt-2 text-sm text-muted-foreground mb-6">
            Sign in to your Parent Account.
          </p>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
              {loginError}
            </div>
          )}

          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              Don't have an account?{' '}
              <Link to="/register-parent" className="font-medium underline hover:text-blue-800">
                Register here
              </Link>
              {' '}and wait for admin approval.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Email / Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. parent@email.com"
                required
                className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password (phone number used during registration)"
                  required
                  className="w-full rounded-xl border border-input bg-card px-4 pr-10 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 group flex w-full items-center justify-center gap-2 rounded-xl bg-hero-gradient px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:glow-primary"
            >
              Sign In
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-border">
            <button onClick={() => navigate({ to: '/parent'} as any)} className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-surface text-center">Parent Demo</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
