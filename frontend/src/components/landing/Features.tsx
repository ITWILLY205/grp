import { motion } from "framer-motion";
import {
  BookOpen,
  BarChart3,
  Video,
  Bell,
  Users,
  ClipboardCheck,
  Shield,
  Calendar,
} from "lucide-react";

const features = [
  {
    icon: ClipboardCheck,
    title: "Attendance Tracking",
    description: "Automated daily attendance with real-time analytics and parent notifications.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: BarChart3,
    title: "Grades & Reports",
    description: "Powerful grading system with GPA calculation, report cards, and PDF exports.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Video,
    title: "Live Video Classes",
    description: "Built-in video conferencing for real-time teaching with recording support.",
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
  {
    icon: BookOpen,
    title: "E-Learning Hub",
    description: "Upload PDFs, videos, and quizzes. Organize by subject and class level.",
    color: "text-chart-5",
    bg: "bg-chart-5/10",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Instant alerts for grades, attendance, announcements via email, SMS, and in-app.",
    color: "text-highlight",
    bg: "bg-highlight/10",
  },
  {
    icon: Users,
    title: "Role-Based Access",
    description: "Separate dashboards for admins, teachers, students, and parents.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Calendar,
    title: "Timetable Management",
    description: "Create and manage class schedules, exam timetables, and academic calendars.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Shield,
    title: "Secure & Scalable",
    description: "Enterprise-grade security with encrypted data, audit logs, and automatic backups.",
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Features() {
  return (
    <section id="features" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Features
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Everything Your School Needs
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A comprehensive platform that replaces dozens of disconnected tools
            with one unified system.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:bg-surface"
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
