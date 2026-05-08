import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section id="about" className="relative px-6 py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-hero-gradient opacity-[0.06] blur-[120px]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-4xl rounded-3xl border border-primary/20 bg-surface p-12 text-center sm:p-16"
      >
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
          Ready to Transform{" "}
          <span className="text-gradient">Your School?</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Join hundreds of schools already using EduPulse to streamline operations,
          improve learning outcomes, and connect with parents.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/login"
            search={{ portal: "student" }}
            className="group flex items-center gap-2 rounded-xl bg-hero-gradient px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:glow-primary"
          >
            Get Started Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/about"
            className="rounded-xl border border-border px-8 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Learn More
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
