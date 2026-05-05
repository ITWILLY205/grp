import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SMS — School Management System" },
      { name: "description", content: "Learn about SMS - our comprehensive school management system designed to streamline educational operations." },
      { property: "og:title", content: "About SMS — School Management System" },
      { property: "og:description", content: "Learn about SMS - our comprehensive school management system designed to streamline educational operations." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              About <span className="text-gradient">SMS</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              School Management System - Empowering Education Through Technology
            </p>
          </div>

          <div className="space-y-12">
            <section className="rounded-lg border border-border bg-card p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                SMS is dedicated to revolutionizing educational administration by providing a comprehensive, 
                user-friendly platform that connects students, teachers, and administrators. We strive to 
                streamline school operations, enhance communication, and improve the overall educational 
                experience through innovative technology solutions.
              </p>
            </section>

            <section className="rounded-lg border border-border bg-card p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To become the leading school management system that transforms educational institutions 
                into digitally empowered learning environments. We envision a future where every school 
                operation is seamless, every student's progress is tracked, and every educational decision 
                is data-driven.
              </p>
            </section>

            <section className="rounded-lg border border-border bg-card p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What We Offer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Academic Management</h3>
                  <p className="text-muted-foreground">
                    Comprehensive grade tracking, attendance management, and academic performance analytics.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Student Services</h3>
                  <p className="text-muted-foreground">
                    Online registration, course management, and personalized student portals.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Administrative Tools</h3>
                  <p className="text-muted-foreground">
                    Streamlined workflows, automated reporting, and efficient resource management.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Communication Hub</h3>
                  <p className="text-muted-foreground">
                    Real-time messaging, announcements, and parent-teacher communication channels.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why Choose SMS?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-medium text-foreground">User-Friendly Interface</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Intuitive design that makes complex school management simple for everyone.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-medium text-foreground">24/7 Accessibility</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Access your school information anytime, anywhere, from any device.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-medium text-foreground">Data Security</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Enterprise-grade security to protect sensitive educational data.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-medium text-foreground">Scalable Solution</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Grows with your institution from small schools to large educational districts.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="text-center py-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Join Our Community</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Be part of the educational revolution. Transform your school management experience 
                with SMS and focus on what matters most - quality education.
              </p>
              <button className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Get Started Today
              </button>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
