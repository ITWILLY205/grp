import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Calendar, Award, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { peopleApi } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/teacher/")({
  component: TeacherOverview,
});

function TeacherOverview() {
  const [mySubjects, setMySubjects] = useState<any[]>([]);
  const [myClasses, setMyClasses] = useState<any[]>([]);
  const [teacherName, setTeacherName] = useState("Teacher");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyData();
  }, []);

  const fetchMyData = async () => {
    setIsLoading(true);
    try {
      const response = await peopleApi.getTeacherMe();
      const teacher = response.data;
      setTeacherName(teacher.user?.full_name || "Teacher");

      const assignments = teacher.assignments || [];
      const uniqueSubjects = new Map();
      const uniqueClasses = new Map();
      assignments.forEach((a: any) => {
        if (a.subject && !uniqueSubjects.has(a.subject.id)) {
          uniqueSubjects.set(a.subject.id, a.subject);
        }
        if (a.stream?.class && !uniqueClasses.has(a.stream.class.id)) {
          uniqueClasses.set(a.stream.class.id, a.stream.class);
        }
      });
      setMySubjects(Array.from(uniqueSubjects.values()));
      setMyClasses(Array.from(uniqueClasses.values()));
    } catch (error) {
      toast.error("Failed to load your assignments");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-7xl px-6 pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-2">Welcome back, {teacherName}!</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">My Subjects</h3>
                <p className="text-2xl font-bold text-gray-900">{mySubjects.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">My Classes</h3>
                <p className="text-2xl font-bold text-gray-900">{myClasses.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Assignments</h3>
                <p className="text-2xl font-bold text-gray-900">{isLoading ? "..." : mySubjects.length + myClasses.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Subjects */}
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">My Subjects</h2>
                <BookOpen className="h-5 w-5 text-gray-400" />
              </div>
              {isLoading ? (
                <p className="text-gray-500 text-sm">Loading...</p>
              ) : mySubjects.length === 0 ? (
                <p className="text-gray-500 text-sm">No subjects assigned yet. Contact admin.</p>
              ) : (
                <div className="space-y-3">
                  {mySubjects.map((subject) => (
                    <div key={subject.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{subject.name}</p>
                        <p className="text-sm text-gray-600">{subject.code || "No code"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* My Classes */}
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">My Classes</h2>
                <AlertCircle className="h-5 w-5 text-gray-400" />
              </div>
              {isLoading ? (
                <p className="text-gray-500 text-sm">Loading...</p>
              ) : myClasses.length === 0 ? (
                <p className="text-gray-500 text-sm">No classes assigned yet. Contact admin.</p>
              ) : (
                <div className="space-y-3">
                  {myClasses.map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{cls.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
