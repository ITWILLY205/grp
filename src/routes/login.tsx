import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap, Shield, Users, UserCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { loadSettings } from "@/lib/settingsStore";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Select Portal — SMS" },
      { name: "description", content: "Select your SMS portal" },
    ],
  }),
  component: PortalSelectionPage,
});

function PortalSelectionPage() {
  const navigate = useNavigate();

  // Maintenance guard
  useEffect(() => {
    const settings = loadSettings();
    if (settings.system.systemClosed) {
      navigate({ to: "/maintenance" });
    }
  }, []);
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
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold leading-tight text-white">
              Welcome to{" "}
              <span className="text-white/90">SMS</span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              The all-in-one school management platform that connects administrators,
              teachers, students, and parents.
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
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-hero-gradient">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-gradient">SMS</span>
            </span>
          </div>

          <h2 className="text-2xl font-bold text-foreground">Select Your Portal</h2>
          <p className="mt-2 text-sm text-muted-foreground mb-8">
            Choose how you want to sign in to the system.
          </p>

          <div className="space-y-4">
            <Link to="/login-staff" className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Staff Portal</h3>
                  <p className="text-sm text-muted-foreground">Teacher Login</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>

            <Link to="/login-student" className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Student Portal</h3>
                  <p className="text-sm text-muted-foreground">Student Access</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>

            <Link to="/login-parent" className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <UserCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Parent Portal</h3>
                  <p className="text-sm text-muted-foreground">Parent & Guardian Access</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>

            <Link to="/discipline-master" className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">DOD Portal</h3>
                  <p className="text-sm text-muted-foreground">Discipline on Duty Access</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
