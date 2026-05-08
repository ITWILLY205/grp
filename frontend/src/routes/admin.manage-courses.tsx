import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, DataTable } from "@/components/dashboard/SharedUI";
import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Edit2, Trash2, BookOpen, Users, Clock, Loader2 } from "lucide-react";
import { academicApi } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/manage-courses")({
  component: ManageCourses,
});

function ManageCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await academicApi.getSubjects();
      setCourses(res.data || []);
    } catch (err: any) {
      toast.error("Failed to load courses");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || course.level?.toLowerCase() === levelFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || course.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesLevel && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg">Loading courses...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Course Management"
        description="Manage academic courses and curriculum"
        action={
          <button className="flex items-center gap-2 rounded-xl bg-hero-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:glow-primary">
            <Plus className="h-4 w-4" />
            Add New Course
          </button>
        }
      />

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Courses</label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or code..."
              className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Level</label>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Levels</option>
            <option value="ordinary">Ordinary Level</option>
            <option value="advanced">Advanced Level</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-full p-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-xl font-bold text-gray-900">{courses.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 rounded-full p-2">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-xl font-bold text-gray-900">—</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 rounded-full p-2">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Teachers</p>
              <p className="text-xl font-bold text-gray-900">—</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 rounded-full p-2">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Duration</p>
              <p className="text-xl font-bold text-gray-900">—</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <DataTable headers={["Course Name", "Code", "Level", "Classes", "Students", "Teachers", "Duration", "Status", "Actions"]}>
          {filteredCourses.map((course) => (
            <tr key={course.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">{course.name}</div>
                  <div className="text-sm text-gray-500">{course.description}</div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 font-mono">{course.code}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  course.level === "Ordinary" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-purple-100 text-purple-800"
                }`}>
                  {course.level}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{course.classes}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{course.students}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{course.teachers}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{course.duration}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  {course.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
}

export default ManageCourses;
