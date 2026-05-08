import { createFileRoute } from "@tanstack/react-router";
import { Award, ClipboardCheck, Bell, TrendingUp } from "lucide-react";
import { studentsData } from "@/lib/mockDatabase";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/parent/")({
  component: ParentOverview,
});

const notifications = [
  { title: "Math midterm score: 88%", time: "2 hours ago", type: "grade" },
  { title: "Attendance marked present today", time: "8 hours ago", type: "attendance" },
  { title: "Parent-Teacher Meeting — April 20", time: "1 day ago", type: "announcement" },
  { title: "Physics assignment due April 20", time: "2 days ago", type: "reminder" },
];

function ParentOverview() {
  const [parentName, setParentName] = useState("Loading...");
  const [primaryChild, setPrimaryChild] = useState<any>(null);

  useEffect(() => {
    try {
      const sessionStr = localStorage.getItem("session_user");
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        setParentName(session.name || "Parent");
        const matchingChild = studentsData.find(s => s.id === session.id);
        if (matchingChild) setPrimaryChild(matchingChild);
      }
    } catch {}
  }, []);

  if (!primaryChild) return <div className="p-8">Loading child data...</div>;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {parentName}</h1>
        <p className="text-gray-600 mt-1">Parent Dashboard</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Monitoring {primaryChild?.name} — {primaryChild?.class} {primaryChild?.stream}</h3>
        <p className="text-sm text-blue-700">Quick summary of your child's academic performance and activities</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Award className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-600">Current GPA</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">3.56</p>
          <p className="text-xs text-green-600">+0.12 from last term</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span className="text-sm text-gray-600">Class Rank</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">#5</p>
          <p className="text-xs text-gray-500">of 35 students</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardCheck className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-600">Attendance</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">96.5%</p>
          <p className="text-xs text-green-600">Above average</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="h-5 w-5 text-red-600" />
            <span className="text-sm text-gray-600">Unread Alerts</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">3</p>
          <p className="text-xs text-red-600">Action required</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Updates</h2>
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  n.type === "grade" ? "bg-blue-600" : n.type === "attendance" ? "bg-green-600" : n.type === "announcement" ? "bg-purple-600" : "bg-yellow-600"
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{n.title}</p>
                  <p className="text-xs text-gray-500">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Subject Performance</h2>
          <div className="space-y-3">
            {[
              { subject: "Mathematics", score: 85, grade: "B+" },
              { subject: "Physics", score: 90, grade: "A-" },
              { subject: "Chemistry", score: 76, grade: "B-" },
              { subject: "English", score: 88, grade: "B+" },
            ].map((s) => (
              <div key={s.subject} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{s.subject}</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    s.grade.startsWith("A") ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}>{s.grade}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${s.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
