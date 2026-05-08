import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SMS — Modern School Management Platform" },
      { name: "description", content: "All-in-one school management system with attendance, grades, e-learning, live classes, and real-time analytics." },
      { property: "og:title", content: "SMS — Modern School Management Platform" },
      { property: "og:description", content: "All-in-one school management system with attendance, grades, e-learning, live classes, and real-time analytics." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Welcome to <span className="text-gradient">SMS</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Your comprehensive school management system. Access grades, manage registration, and stay connected with your educational journey.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground">Academic Performance</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Track your grades and academic progress in real-time. View detailed reports and performance analytics.
              </p>
            </div>
            
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground">Course Registration</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Register for courses and manage your academic schedule. Get updates on class availability and prerequisites.
              </p>
            </div>
            
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground">Student Portal</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Access all your student services in one place. From assignments to announcements, everything at your fingertips.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
