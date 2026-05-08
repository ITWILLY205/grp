import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { 
  AlertTriangle, 
  Shield, 
  Users, 
  FileText, 
  Settings, 
  ChevronRight,
  User,
  Lock,
  Unlock,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter
} from "lucide-react";

export const Route = createFileRoute("/dashboard-with-sidebar")({
  component: DashboardWithSidebar,
  head: () => ({
    meta: [
      { title: "Dashboard — SMS" },
      { name: "description", content: "Dashboard with sidebar for discipline, permissions, and student cases" },
    ],
  }),
});

function DashboardWithSidebar() {
  const [activeSection, setActiveSection] = useState("discipline");

  const sidebarItems = [
    {
      id: "discipline",
      label: "Discipline",
      icon: AlertTriangle,
      badge: 12
    },
    {
      id: "permissions",
      label: "Permissions",
      icon: Shield,
      badge: 3
    },
    {
      id: "student-cases",
      label: "Student Cases",
      icon: FileText,
      badge: 8
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "discipline":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Discipline Management</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                <Plus className="w-4 h-4" />
                New Incident
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Total Incidents</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">47</p>
                <p className="text-sm text-muted-foreground">This month</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Pending</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">Awaiting review</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Resolved</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">35</p>
                <p className="text-sm text-muted-foreground">Successfully handled</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Recent Incidents</h3>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-surface/50 rounded-lg hover:bg-surface">
                    <Search className="w-4 h-4" />
                    <span className="text-sm">Search</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-surface/50 rounded-lg hover:bg-surface">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">Filter</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-surface/50 rounded-lg hover:bg-surface/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div>
                      <p className="font-medium text-foreground">Fighting Incident</p>
                      <p className="text-sm text-muted-foreground">Class 3A - John Doe</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-surface rounded">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1 hover:bg-surface rounded">
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface/50 rounded-lg hover:bg-surface/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div>
                      <p className="font-medium text-foreground">Disruptive Behavior</p>
                      <p className="text-sm text-muted-foreground">Class 2B - Sarah Miller</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">5 hours ago</span>
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-surface rounded">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1 hover:bg-surface rounded">
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface/50 rounded-lg hover:bg-surface/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="font-medium text-foreground">Late Arrival</p>
                      <p className="text-sm text-muted-foreground">Class 1A - Michael Johnson</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">1 day ago</span>
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-surface rounded">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1 hover:bg-surface rounded">
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "permissions":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">User Permissions</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                <Settings className="w-4 h-4" />
                Manage Permissions
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Active Permissions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Unlock className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-foreground">View Discipline Records</span>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Unlock className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-foreground">Create Incidents</span>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Unlock className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-foreground">Edit Student Cases</span>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Restricted Permissions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-foreground">Delete Records</span>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Restricted</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-foreground">Export Data</span>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Restricted</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-foreground">System Settings</span>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Limited</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Permission Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Total Permissions</span>
                  <span className="text-sm font-bold text-foreground">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Active</span>
                  <span className="text-sm font-bold text-green-600">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Restricted</span>
                  <span className="text-sm font-bold text-red-600">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Limited</span>
                  <span className="text-sm font-bold text-yellow-600">2</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "student-cases":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Student Cases</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                <Plus className="w-4 h-4" />
                New Case
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Total Cases</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">28</p>
                <p className="text-sm text-muted-foreground">All time</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Open</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">8</p>
                <p className="text-sm text-muted-foreground">In progress</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Closed</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">15</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Recurring</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">5</p>
                <p className="text-sm text-muted-foreground">Repeat offenders</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Recent Student Cases</h3>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-surface/50 rounded-lg hover:bg-surface">
                    <Search className="w-4 h-4" />
                    <span className="text-sm">Search</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-surface/50 rounded-lg hover:bg-surface">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">Filter</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-surface/50 rounded-lg hover:bg-surface/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">JD</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">John Doe</p>
                      <p className="text-sm text-muted-foreground">Case #001 - Fighting</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Open</span>
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-surface rounded">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1 hover:bg-surface rounded">
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1 hover:bg-surface rounded">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface/50 rounded-lg hover:bg-surface/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">SM</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Sarah Miller</p>
                      <p className="text-sm text-muted-foreground">Case #002 - Disruptive</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Closed</span>
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-surface rounded">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1 hover:bg-surface rounded">
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1 hover:bg-surface rounded">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface/50 rounded-lg hover:bg-surface/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">MJ</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Michael Johnson</p>
                      <p className="text-sm text-muted-foreground">Case #003 - Late Arrival</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Open</span>
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-surface rounded">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1 hover:bg-surface rounded">
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1 hover:bg-surface rounded">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Select a section from the sidebar</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
              <div className="rounded-xl border border-border bg-card p-4">
                <h2 className="text-lg font-semibold text-foreground mb-4">Navigation</h2>
                <nav className="space-y-2">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        activeSection === item.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-surface text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          activeSection === item.id
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
