import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Users, BookOpen, Video, ClipboardCheck, Calendar, Award, TrendingUp, AlertCircle, Plus } from "lucide-react";

export const Route = createFileRoute("/teacher/")({
  component: TeacherOverview,
});

const todaySchedule = [
  { subject: "Advanced Mathematics", class: "Form 6A", time: "7:30 AM", room: "Room 105", type: "In-person", duration: "45 min" },
  { subject: "Mathematics", class: "Form 3A", time: "8:30 AM", room: "Room 101", type: "In-person", duration: "45 min" },
  { subject: "Mathematics", class: "Form 3B", time: "9:30 AM", room: "Room 102", type: "In-person", duration: "45 min" },
  { subject: "Physics", class: "Form 4A", time: "11:00 AM", room: "Room 201", type: "In-person", duration: "45 min" },
  { subject: "Chemistry Lab", class: "Form 5A", time: "2:00 PM", room: "Lab 301", type: "Laboratory", duration: "90 min" },
  { subject: "Calculus", class: "Form 6B", time: "3:45 PM", room: "Room 106", type: "In-person", duration: "45 min" },
];

const weakStudents = [
  { name: "Kevin Zhang", class: "Form 3A", subject: "Mathematics", average: "42%", attendance: "70%" },
  { name: "Laura White", class: "Form 3B", subject: "Mathematics", average: "38%", attendance: "65%" },
  { name: "Nina Thompson", class: "Form 4A", subject: "Physics", average: "45%", attendance: "68%" },
  { name: "Penny Anderson", class: "Form 5A", subject: "Chemistry", average: "35%", attendance: "60%" },
  { name: "Michael Brown", class: "Form 6A", subject: "Advanced Mathematics", average: "48%", attendance: "72%" },
];

function TeacherOverview() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-7xl px-6 pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
          </div>
          <button
            onClick={() => navigate({ to: "/admin/add-teacher" })}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Teacher
          </button>
        </div>

        {/* Classes Today Statistic */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Classes Today</h3>
              <p className="text-2xl font-bold text-gray-900">6</p>
              <p className="text-xs text-gray-500 mt-1">5.5 hours teaching</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {todaySchedule.map((class_, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-900">{class_.time.split(" ")[0]}</p>
                        <p className="text-xs text-gray-500">{class_.time.split(" ")[1]}</p>
                        <p className="text-xs text-gray-400">{class_.duration}</p>
                      </div>
                      <div className="h-8 w-px bg-gray-300"></div>
                      <div>
                        <p className="font-medium text-gray-900">{class_.subject}</p>
                        <p className="text-sm text-gray-600">{class_.class} • {class_.room}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        class_.type === "Laboratory" 
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {class_.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weak Students */}
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Weak Students in Courses</h2>
                <AlertCircle className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {weakStudents.map((student, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.class} • {student.subject}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">{student.average}</p>
                      <p className="text-xs text-gray-500">Attendance: {student.attendance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
