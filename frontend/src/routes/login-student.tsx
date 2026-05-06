import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { GraduationCap, ArrowRight, Users } from "lucide-react";
import { motion } from "framer-motion";
import { logLogin, logFailedLogin } from "@/utils/auditLog";
import { authApi } from "@/lib/api";
import { loadSettings } from "@/lib/settingsStore";

export const Route = createFileRoute("/login-student")({
  head: () => ({
    meta: [
      { title: "Student Login — SMS" },
    ],
  }),
  component: StudentLoginPage,
});

function StudentLoginPage() {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [loginError, setLoginError] = useState("");

  // Maintenance guard — block access when system is closed
  useEffect(() => {
    const settings = loadSettings();
    if (settings.system.systemClosed || settings.blockedRoles.includes("Student")) {
      navigate({ to: "/maintenance" });
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await authApi.studentLogin({ student_id: indexNumber, full_name: studentName });
      
      if (response.data.success && response.data.user.role === 'STUDENT') {
        const user = response.data.user;
        const settings = loadSettings();
        
        if (settings.blockedUsers.includes(user.full_name)) {
          setLoginError("Your account has been blocked by the administrator.");
          logFailedLogin(user.full_name, "Attempted login while blocked");
          return;
        }
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem("session_user", JSON.stringify({ role: "student", id: user.id, name: user.full_name }));
        logLogin(user.full_name, indexNumber, "student", { loginMethod: "database_index" });
        navigate({ to: "/student" });
      } else if (response.data.success) {
        setLoginError("Access Denied: This account is not a Student account.");
      }
    } catch (error: any) {
      setLoginError("Invalid student credentials. Not found in database.");
      logFailedLogin(studentName || "unknown", "Invalid student credentials");
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
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold leading-tight text-white">
              Student Portal
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              Access your grades, view your schedule, and check assignments.
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
                 <Users className="h-5 w-5 text-primary-foreground" />
               </div>
               <span className="text-xl font-bold">Student Login</span>
             </div>
             <Link to="/login" className="text-sm text-primary hover:underline font-medium">Back to Portals</Link>
          </div>

          <p className="mt-2 text-sm text-muted-foreground mb-6">
            Sign in to your Student Account.
          </p>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Alice Johnson"
                required
                className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Index Number</label>
              <input
                type="text"
                value={indexNumber}
                onChange={(e) => setIndexNumber(e.target.value)}
                placeholder="e.g. STU0012024"
                required
                className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
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
            <button onClick={() => navigate({ to: '/student/'} as any)} className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-surface text-center">Student Demo</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
