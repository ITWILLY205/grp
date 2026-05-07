import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Users, Loader2, Search, User } from "lucide-react";
import { peopleApi, academicApi } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/assign-classes")({
  component: AssignClasses,
});

function AssignClasses() {
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState<any>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherSearch, setTeacherSearch] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teachersRes, subjectsRes, classesRes] = await Promise.all([
        peopleApi.getTeachers(),
        academicApi.getSubjects(),
        academicApi.getClasses(),
      ]);
      setTeachers(teachersRes.data || []);
      setSubjects(subjectsRes.data || []);
      setClasses(classesRes.data || []);
    } catch (err: any) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTeacher = (selectedTeacher: any) => {
    setTeacher(selectedTeacher);
    const assignments = selectedTeacher.assignments || [];
    const currentSubjects = [...new Set(assignments.map((a: any) => a.subject?.name).filter(Boolean))] as string[];
    const currentClasses = [...new Set(assignments.map((a: any) => a.stream?.class?.name || a.class?.name).filter(Boolean))] as string[];
    setSelectedSubjects(currentSubjects.length ? currentSubjects : []);
    setSelectedClasses(currentClasses.length ? currentClasses : []);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg">Loading teacher...</span>
        </div>
      </div>
    );
  }

  const filteredTeachers = teachers.filter(t => {
    const name = t.user?.full_name || t.name || "";
    return name.toLowerCase().includes(teacherSearch.toLowerCase());
  });

  const teacherName = teacher?.user?.full_name || "Teacher";
  const initials = teacherName !== "Teacher" ? teacherName.charAt(0) : "T";
  const staffId = teacher?.staff_id || (teacher?.id ? `TCH-${teacher.id}` : "—");
  const department = teacher?.department || "—";

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleClassToggle = (cls: string) => {
    setSelectedClasses(prev =>
      prev.includes(cls)
        ? prev.filter(c => c !== cls)
        : [...prev, cls]
    );
  };

  const handleAssign = async () => {
    if (selectedSubjects.length === 0 || selectedClasses.length === 0) {
      toast.error("Please select at least one subject and one class");
      return;
    }
    try {
      await peopleApi.assignClasses(teacher.id, {
        subjects: selectedSubjects,
        classes: selectedClasses,
      });
      toast.success(`Assignment saved successfully for ${teacherName}!`);
      setTimeout(() => {
        navigate({ to: "/admin/teachers" });
      }, 1500);
    } catch (error: any) {
      const message = error?.response?.data?.error || error?.message || "Failed to save assignment. Please try again.";
      toast.error(Array.isArray(message) ? JSON.stringify(message) : message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mx-auto px-6 pt-8 pb-12">
        <div className="mb-6">
          <button
            onClick={() => navigate({ to: "/admin/teachers" })}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Teachers
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Assign Classes & Subjects</h1>
          <p className="text-gray-600 mt-2">Select a teacher to assign classes and subjects</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {/* Teacher Search */}
          {!teacher && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Search Teacher
              </h3>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                    placeholder="Search teachers by name..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {filteredTeachers.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTeacher(t)}
                    className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {(t.user?.full_name || t.name || "T").charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{t.user?.full_name || t.name || "Unknown"}</p>
                      <p className="text-sm text-gray-600">{t.staff_id || `TCH-${t.id}`}</p>
                    </div>
                  </button>
                ))}
              </div>
              {filteredTeachers.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">No teachers found matching your search.</p>
              )}
            </div>
          )}

          {/* Teacher Information - Show only after teacher is selected */}
          {teacher && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                    {initials}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{teacherName}</h3>
                    <p className="text-sm text-gray-600">{staffId} • {department}</p>
                    <div className="flex gap-4 mt-2">
                      <div className="text-sm">
                        <span className="text-gray-500">Current Subjects:</span>
                        <span className="ml-2 font-medium">{selectedSubjects.join(", ") || "—"}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Current Classes:</span>
                        <span className="ml-2 font-medium">{selectedClasses.join(", ") || "—"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setTeacher(null);
                    setSelectedSubjects([]);
                    setSelectedClasses([]);
                    setTeacherSearch("");
                  }}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Change Teacher
                </button>
              </div>
            </div>
          )}

          {/* Subjects Selection - Only show after teacher is selected */}
          {teacher && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Select Subjects to Teach
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectToggle(subject.name)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedSubjects.includes(subject.name)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {subject.name}
                  </button>
                ))}
              </div>
              {subjects.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">No subjects available. Please add subjects in Academic Structure first.</p>
              )}
              {selectedSubjects.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Selected Subjects:</strong> {selectedSubjects.join(", ")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Classes Selection - Only show after teacher is selected */}
          {teacher && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Select Classes to Assign
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {classes.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => handleClassToggle(cls.name)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedClasses.includes(cls.name)
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {cls.name}
                  </button>
                ))}
              </div>
              {classes.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">No classes available. Please add classes in Academic Structure first.</p>
              )}
              {selectedClasses.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>Selected Classes:</strong> {selectedClasses.join(", ")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons - Only show after teacher is selected */}
          {teacher && (
            <div className="flex gap-3">
              <button
                onClick={handleAssign}
                disabled={selectedSubjects.length === 0 || selectedClasses.length === 0}
                className={`px-6 py-3 rounded-lg font-medium ${
                  selectedSubjects.length > 0 && selectedClasses.length > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Confirm Assignment
              </button>
              <button
                onClick={() => navigate({ to: "/admin/teachers" })}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
