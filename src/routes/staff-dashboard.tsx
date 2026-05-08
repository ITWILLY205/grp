import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Shield, Users, BookOpen, Settings, LogOut, User, AlertTriangle, FileText, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/staff-dashboard")({
  component: StaffDashboardPage,
  head: () => ({
    meta: [
      { title: "Staff Dashboard — SMS" },
      { name: "description", content: "Staff dashboard for SMS School Management System" },
    ],
  }),
});

function StaffDashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Staff Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Manage your school operations from here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-foreground">Students</h3>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">245</p>
              <p className="text-sm text-muted-foreground">Total enrolled</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-foreground">Classes</h3>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">12</p>
              <p className="text-sm text-muted-foreground">Active classes</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-foreground">Staff</h3>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">18</p>
              <p className="text-sm text-muted-foreground">Total staff</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-foreground">Settings</h3>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">--</p>
              <p className="text-sm text-muted-foreground">System settings</p>
            </div>
          </div>

          {/* Disciplinary Dashboard Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Disciplinary Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Total Incidents</h3>
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">23</p>
                <p className="text-sm text-muted-foreground">This month</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Pending Reports</h3>
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">7</p>
                <p className="text-sm text-muted-foreground">Awaiting review</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Resolved Cases</h3>
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">16</p>
                <p className="text-sm text-muted-foreground">This month</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Students Involved</h3>
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">31</p>
                <p className="text-sm text-muted-foreground">Unique students</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Incidents</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-surface/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Fighting incident - Class 3A</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-surface/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Disruptive behavior - Class 2B</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-surface/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Late arrival - Class 1A</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">Disciplinary Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-surface/50 rounded-lg hover:bg-surface transition-colors flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-foreground">Report New Incident</span>
                  </button>
                  <button className="w-full text-left p-3 bg-surface/50 rounded-lg hover:bg-surface transition-colors flex items-center gap-3">
                    <FileText className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-foreground">View Pending Reports</span>
                  </button>
                  <button className="w-full text-left p-3 bg-surface/50 rounded-lg hover:bg-surface transition-colors flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-foreground">Disciplinary Analytics</span>
                  </button>
                  <button className="w-full text-left p-3 bg-surface/50 rounded-lg hover:bg-surface transition-colors flex items-center gap-3">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-foreground">Student Disciplinary History</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-surface/50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">New student registration</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface/50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Grade report submitted</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface/50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Staff meeting scheduled</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-surface/50 rounded-lg hover:bg-surface transition-colors flex items-center gap-3">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Manage Students</span>
                </button>
                <button className="w-full text-left p-3 bg-surface/50 rounded-lg hover:bg-surface transition-colors flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">View Classes</span>
                </button>
                <button className="w-full text-left p-3 bg-surface/50 rounded-lg hover:bg-surface transition-colors flex items-center gap-3">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Staff Management</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-3"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-600">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
