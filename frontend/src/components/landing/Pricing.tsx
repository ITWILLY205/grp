import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "For small schools getting started",
    features: [
      "Up to 200 students",
      "5 teacher accounts",
      "Attendance tracking",
      "Basic grade management",
      "Email notifications",
      "PDF report cards",
    ],
    cta: "Start Free Trial",
    featured: false,
  },
  {
    name: "Professional",
    price: "$149",
    period: "/month",
    description: "For growing schools that need more",
    features: [
      "Up to 2,000 students",
      "Unlimited teachers",
      "E-learning module",
      "Live video classes",
      "SMS & email notifications",
      "Advanced analytics dashboard",
      "Audit & activity logs",
      "Priority support",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For school networks & districts",
    features: [
      "Unlimited students & staff",
      "Multi-school management",
      "White-label branding",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "On-premise deployment",
      "Training & onboarding",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Pricing
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Start with a 14-day free trial. No credit card required.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.featured
                  ? "border-2 border-primary bg-surface glow-primary"
                  : "border border-border bg-card"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-hero-gradient px-4 py-1">
                  <Zap className="h-3 w-3 text-primary-foreground" />
                  <span className="text-xs font-bold text-primary-foreground">Most Popular</span>
                </div>
              )}

              <h3 className="text-lg font-bold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                {plan.period && (
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                )}
              </div>

              <button
                className={`mt-8 w-full rounded-xl py-3 text-sm font-semibold transition-all ${
                  plan.featured
                    ? "bg-hero-gradient text-primary-foreground hover:glow-primary"
                    : "border border-border bg-secondary text-foreground hover:bg-muted"
                }`}
              >
                {plan.cta}
              </button>

              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
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
