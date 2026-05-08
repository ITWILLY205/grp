import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { User, BookOpen, Award, FileText, LogOut, TrendingUp, Calendar } from "lucide-react";

export const Route = createFileRoute("/student-dashboard")({
  component: StudentDashboardPage,
  head: () => ({
    meta: [
      { title: "Student Dashboard — SMS" },
      { name: "description", content: "Student dashboard for SMS School Management System" },
    ],
  }),
});

function StudentDashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-white text-foreground">
      <Header />
      <main className="pt-20">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Student Dashboard</h1>
            <p className="text-sm text-gray-600">
              Welcome back! Track your academic progress and access your resources.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="rounded-xl border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Grades</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">85%</p>
              <p className="text-sm text-gray-600">Average score</p>
            </div>

            <div className="rounded-xl border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Classes</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">6</p>
              <p className="text-sm text-gray-600">Enrolled classes</p>
            </div>

            <div className="rounded-xl border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Attendance</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">92%</p>
              <p className="text-sm text-gray-600">Attendance rate</p>
            </div>

            <div className="rounded-xl border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Assignments</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">3</p>
              <p className="text-sm text-gray-600">Pending tasks</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Performance</h3>
              <div className="space-y-3"></div>
            </div>

            <div className="rounded-xl border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Recent Activity</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-gray-900">Last Assignment Submitted</span>
                  </div>
                  <span className="text-xs text-gray-600">2 days ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-gray-900">Math Test Completed</span>
                  </div>
                  <span className="text-xs text-gray-600">Score: 88/100</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Subject Marks</h3>
              <div className="space-y-3">
                {[
                  { subject: "Mathematics", teacher: "Ms. Johnson", grade: "A", score: 92, date: "2024-03-15" },
                  { subject: "English", teacher: "Mr. Smith", grade: "B+", score: 85, date: "2024-03-10" },
                  { subject: "Science", teacher: "Dr. Brown", grade: "B", score: 78, date: "2024-03-20" },
                  { subject: "History", teacher: "Ms. Davis", grade: "A-", score: 88, date: "2024-03-08" },
                ].map((mark, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{mark.subject}</p>
                          <p className="text-xs text-gray-600">Teacher: {mark.teacher}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>Grade: {mark.grade}</span>
                        <span>•</span>
                        <span>Score: {mark.score}%</span>
                        <span>•</span>
                        <span>{mark.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          mark.grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                          mark.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                          mark.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {mark.grade}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Performance Reports</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-gray-900">Download Full Report</span>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-gray-900">View Progress Chart</span>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-gray-900">Academic Calendar</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate({ to: "/view-marks" })}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-gray-900">View Marks</span>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-gray-900">My Classes</span>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-gray-900">Assignments</span>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-gray-900">Attendance</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
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
