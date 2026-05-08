import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [{ title: "Setup — SMS" }],
  }),
  component: SetupPage,
});

function SetupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/setup", {
        username,
        password,
        full_name: fullName,
      });

      if (response.data.success) {
        toast.success("Admin account created! Please login.");
        navigate({ to: "/login-staff" });
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Setup failed";
      setError(typeof msg === "string" ? msg : "Setup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-6"
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-hero-gradient">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">First Time Setup</span>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Create the first admin account for your school management system.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-6 group flex w-full items-center justify-center gap-2 rounded-xl bg-hero-gradient px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:glow-primary ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Creating..." : "Create Admin Account"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
