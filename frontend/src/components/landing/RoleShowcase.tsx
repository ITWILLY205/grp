import { motion } from "framer-motion";
import { ShieldCheck, BookMarked, GraduationCap, Heart } from "lucide-react";

const roles = [
  {
    icon: ShieldCheck,
    role: "Admin",
    color: "from-primary to-chart-3",
    borderColor: "border-primary/30",
    features: [
      "Full system control & user management",
      "Generate school-wide reports (PDF/Excel)",
      "Configure grading & academic structure",
      "Monitor activity logs & performance",
    ],
  },
  {
    icon: BookMarked,
    role: "Teacher",
    color: "from-accent to-highlight",
    borderColor: "border-accent/30",
    features: [
      "Enter & update student marks",
      "Record & manage attendance",
      "Upload e-learning materials",
      "Schedule & host live video classes",
    ],
  },
  {
    icon: GraduationCap,
    role: "Student",
    color: "from-chart-5 to-chart-4",
    borderColor: "border-chart-5/30",
    features: [
      "View marks, grades & reports",
      "Access e-learning materials",
      "Take quizzes & submit assignments",
      "Join live video classes",
    ],
  },
  {
    icon: Heart,
    role: "Parent",
    color: "from-chart-4 to-destructive",
    borderColor: "border-chart-4/30",
    features: [
      "Monitor student performance",
      "Track attendance in real-time",
      "Receive instant notifications",
      "View academic progress reports",
    ],
  },
];

export function RoleShowcase() {
  return (
    <section className="relative px-6 py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-accent opacity-[0.04] blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            User Roles
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Tailored for Everyone
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Every user gets a personalized dashboard with tools designed for their role.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r, i) => (
            <motion.div
              key={r.role}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl border ${r.borderColor} bg-card p-6`}
            >
              <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${r.color}`}>
                <r.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">{r.role}</h3>
              <ul className="mt-4 space-y-3">
                {r.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
