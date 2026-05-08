import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, ArrowLeft, UserCircle, CheckCircle, Mail, Phone, User, Home } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { peopleApi } from "@/lib/api";

export const Route = createFileRoute("/register-parent")({
  head: () => ({
    meta: [
      { title: "Parent Registration — SMS" },
    ],
  }),
  component: ParentRegistrationPage,
});

function ParentRegistrationPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    childName: "",
    childStudentId: "",
    address: "",
    relationship: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await peopleApi.registerParent({
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        child_student_id: form.childStudentId,
        relationship: form.relationship,
        address: form.address,
      });

      toast.success("Registration submitted! Waiting for admin approval.");
      setSubmitted(true);
    } catch (error: any) {
      const message = error?.response?.data?.error || "Failed to submit registration. Please try again.";
      toast.error(Array.isArray(message) ? JSON.stringify(message) : message);
    }
  };

  if (submitted) {
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
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-extrabold leading-tight text-white">
                Registration Submitted!
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-white/80">
                Your account is pending admin approval. You'll receive an email once approved.
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
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
                Registration Submitted!
              </h1>
              <p className="text-muted-foreground mb-8">
                Your parent account registration has been submitted successfully.
                An administrator will review your application and approve or reject it.
              </p>
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-foreground mb-3">What happens next?</h3>
                <div className="space-y-2 text-sm text-muted-foreground text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>Admin reviews your application</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>Verification of child information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span>Email notification of approval/rejection</span>
                  </div>
                </div>
              </div>
              <Link to="/login-parent" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Parent Login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

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
              Parent Registration
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              Create your parent account to monitor your child's academic progress.
              Admin approval required.
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
               <span className="text-xl font-bold">Register Parent Account</span>
             </div>
             <Link to="/login-parent" className="text-sm text-primary hover:underline font-medium">Back to Login</Link>
          </div>

          <p className="mt-2 text-sm text-muted-foreground mb-6">
            Fill in your details. Your account will be activated after admin verification.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Your Full Name
              </label>
              <input
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                placeholder="e.g. Robert Johnson"
                required
                className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. parent@email.com"
                required
                className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Telephone Number
              </label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. +1234567891"
                required
                className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Child Information</h3>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Child's Full Name
              </label>
              <input
                name="childName"
                type="text"
                value={form.childName}
                onChange={handleChange}
                placeholder="e.g. Alice Johnson"
                required
                className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Child's Student ID / Index Number
              </label>
              <input
                name="childStudentId"
                type="text"
                value={form.childStudentId}
                onChange={handleChange}
                placeholder="e.g. STD001234"
                required
                className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Relationship to Child
              </label>
              <select
                name="relationship"
                value={form.relationship}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="">Select relationship</option>
                <option value="father">Father</option>
                <option value="mother">Mother</option>
                <option value="guardian">Guardian</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home Address
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter your home address"
                rows={3}
                required
                className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
            
            <button
              type="submit"
              className="mt-6 group flex w-full items-center justify-center gap-2 rounded-xl bg-hero-gradient px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:glow-primary"
            >
              Submit Registration
              <GraduationCap className="h-4 w-4" />
            </button>

            <p className="text-xs text-muted-foreground text-center">
              By submitting, you confirm the information is accurate. An admin will review your application.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
