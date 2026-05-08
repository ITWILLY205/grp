import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { RoleShowcase } from "@/components/landing/RoleShowcase";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduPulse — Modern School Management Platform" },
      { name: "description", content: "All-in-one school management system with attendance, grades, e-learning, live classes, and real-time analytics." },
      { property: "og:title", content: "EduPulse — Modern School Management Platform" },
      { property: "og:description", content: "All-in-one school management system with attendance, grades, e-learning, live classes, and real-time analytics." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Features />
        <RoleShowcase />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
