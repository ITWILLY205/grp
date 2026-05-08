import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Play, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-hero-gradient opacity-[0.07] blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-accent opacity-[0.05] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5"
        >
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-xs font-medium text-muted-foreground">
            The future of school management is here
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
        >
          One Platform to{" "}
          <span className="text-gradient">Power Your</span>
          <br />
          Entire School
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          From attendance to live classes, grades to analytics — EduPulse unifies
          administration, learning, and communication into one seamless experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            to="/login"
            search={{ portal: "student" }}
            className="group flex items-center gap-2 rounded-xl bg-hero-gradient px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:glow-primary"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/about"
            className="flex items-center gap-2 rounded-xl border border-border bg-surface px-8 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            <Play className="h-4 w-4 text-primary" />
            Learn More
          </Link>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4"
        >
          {[
            { value: "500+", label: "Schools" },
            { value: "120K", label: "Students" },
            { value: "8K", label: "Teachers" },
            { value: "99.9%", label: "Uptime" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-gradient sm:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
