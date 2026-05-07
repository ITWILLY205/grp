import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Building2, User, GraduationCap, FileText, Calendar, Users,
  BarChart3, Plus, Edit2, Trash2, Save, Check, AlertTriangle, Download, Printer, Filter, Search, Eye
} from "lucide-react";
import { logDisciplineIncident, logDisciplineAction } from "@/utils/auditLog";
import { academicApi, peopleApi } from "@/lib/api";
import { toast } from "sonner";
import { useEffect } from "react";

export const Route = createFileRoute("/admin/academics")({
  component: AdminAcademics,
});

type SubModule = 
  | "structure" 
  | "assignment" 
  | "grading" 
  | "marks" 
  | "attendance" 
  | "reports" 
  | "analytics"
  | "discipline";

function AdminAcademics() {
  const [activeModule, setActiveModule] = useState<SubModule>("structure");

  const modules = [
    { id: "structure" as SubModule, label: "Academic Structure", icon: Building2, description: "Years, terms, classes, subjects" },
    { id: "assignment" as SubModule, label: "Teacher Assignment", icon: User, description: "Assign teachers to subjects" },
    { id: "grading" as SubModule, label: "Grading System", icon: GraduationCap, description: "Assessment types & grade scales" },
    { id: "marks" as SubModule, label: "Marks Management", icon: FileText, description: "Enter and manage marks" },
    { id: "attendance" as SubModule, label: "Attendance", icon: Calendar, description: "Track student attendance" },
    { id: "reports" as SubModule, label: "Progressive Reports", icon: FileText, description: "Generate student reports" },
    { id: "analytics" as SubModule, label: "Class Analytics", icon: BarChart3, description: "Performance insights" },
    { id: "discipline" as SubModule, label: "Discipline", icon: AlertTriangle, description: "Manage student behavior" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-7xl mx-auto px-6 pt-8 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Academics</h1>
          <p className="text-gray-600 mt-2">Configure and manage all academic operations</p>
        </div>

        {/* Module Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                activeModule === module.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${
                  activeModule === module.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  <module.icon className="h-5 w-5" />
                </div>
                <span className="font-semibold text-gray-900">{module.label}</span>
              </div>
              <p className="text-sm text-gray-600">{module.description}</p>
            </button>
          ))}
        </div>

        {/* Active Module Content */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          {activeModule === "structure" && <AcademicStructure />}
          {activeModule === "assignment" && <TeacherAssignment />}
          {activeModule === "grading" && <GradingSystem />}
          {activeModule === "marks" && <MarksManagement />}
          {activeModule === "attendance" && <AttendanceManagement />}
          {activeModule === "reports" && <ProgressiveReports />}
          {activeModule === "analytics" && <ClassAnalytics />}
          {activeModule === "discipline" && <DisciplineManagement />}
        </div>
      </div>
    </div>
  );
}

// A. Academic Structure Setup
function AcademicStructure() {
  const [years, setYears] = useState<{id: number, name: string, status: string}[]>([]);
  const [terms, setTerms] = useState<{id: number, name: string, year_name: string, start_date: string, end_date: string}[]>([]);
  const [classes, setClasses] = useState<{id: number, name: string}[]>([]);
  const [streams, setStreams] = useState<{id: number, name: string, class_id: number, class?: {name: string}}[]>([]);
  const [subjects, setSubjects] = useState<{id: number, name: string, code?: string, category?: string}[]>([]);

  useEffect(() => {
    fetchYears();
    fetchTerms();
    fetchClasses();
    fetchStreams();
    fetchSubjects();
  }, []);

  const fetchYears = async () => {
    try {
      const response = await academicApi.getYears();
      setYears(response.data);
    } catch (error) {
      toast.error("Failed to load academic years");
    }
  };

  const fetchTerms = async () => {
    try {
      const response = await academicApi.getTerms();
      setTerms(response.data);
    } catch (error) {
      toast.error("Failed to load terms");
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await academicApi.getClasses();
      setClasses(response.data);
    } catch (error) {
      toast.error("Failed to load classes");
    }
  };

  const fetchStreams = async () => {
    try {
      const response = await academicApi.getStreams();
      setStreams(response.data);
    } catch (error) {
      toast.error("Failed to load streams");
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await academicApi.getSubjects();
      setSubjects(response.data);
    } catch (error) {
      toast.error("Failed to load subjects");
    }
  };

  const [showAddYear, setShowAddYear] = useState(false);
  const [newYearName, setNewYearName] = useState("");
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [showAddStream, setShowAddStream] = useState(false);
  const [newStreamName, setNewStreamName] = useState("");
  const [selectedClassForStream, setSelectedClassForStream] = useState<number | null>(null);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [editingYearId, setEditingYearId] = useState<number | null>(null);
  const [editingTermId, setEditingTermId] = useState<number | null>(null);
  const [editingClassId, setEditingClassId] = useState<number | null>(null);

  // Form states for editing
  const [editYearName, setEditYearName] = useState("");
  const [editTermName, setEditTermName] = useState("");
  const [editTermStart, setEditTermStart] = useState("");
  const [editTermEnd, setEditTermEnd] = useState("");
  const [editClassName, setEditClassName] = useState("");

  const handleAddYear = async () => {
    if (newYearName.trim()) {
      try {
        await academicApi.addYear(newYearName.trim());
        toast.success("Academic year added successfully");
        setNewYearName("");
        setShowAddYear(false);
        fetchYears(); // Refresh the list
      } catch (error) {
        toast.error("Failed to save academic year to MySQL");
      }
    }
  };

  const handleAddSubject = async () => {
    if (newSubjectName.trim()) {
      try {
        await academicApi.addSubject({ name: newSubjectName.trim() });
        toast.success("Subject added successfully");
        setNewSubjectName("");
        setShowAddSubject(false);
        fetchSubjects();
      } catch (error) {
        toast.error("Failed to save subject to database");
      }
    }
  };

  const handleAddClass = async () => {
    if (newClassName.trim()) {
      try {
        await academicApi.addClass(newClassName.trim());
        toast.success("Class added successfully");
        setNewClassName("");
        setShowAddClass(false);
        fetchClasses();
      } catch (error) {
        toast.error("Failed to save class to database");
      }
    }
  };

  const handleAddStream = async () => {
    if (newStreamName.trim() && selectedClassForStream !== null) {
      try {
        await academicApi.addStream(selectedClassForStream, newStreamName.trim());
        toast.success("Stream added successfully");
        setNewStreamName("");
        setSelectedClassForStream(null);
        setShowAddStream(false);
        fetchStreams();
      } catch (error) {
        toast.error("Failed to save stream to database");
      }
    }
  };

  const startEditYear = (year: typeof years[0]) => {
    setEditingYearId(year.id);
    setEditYearName(year.name);
  };

  const saveEditYear = (id: number) => {
    setYears(years.map(y => y.id === id ? { ...y, name: editYearName } : y));
    setEditingYearId(null);
  };

  const startEditTerm = (term: typeof terms[0]) => {
    setEditingTermId(term.id);
    setEditTermName(term.name);
    setEditTermStart(term.start_date);
    setEditTermEnd(term.end_date);
  };

  const saveEditTerm = (id: number) => {
    setTerms(terms.map(t => t.id === id ? { ...t, name: editTermName, start_date: editTermStart, end_date: editTermEnd } : t));
    setEditingTermId(null);
  };

  const startEditClass = (cls: typeof classes[0]) => {
    setEditingClassId(cls.id);
    setEditClassName(cls.name);
  };

  const saveEditClass = (id: number) => {
    setClasses(classes.map(c => c.id === id ? { ...c, name: editClassName } : c));
    setEditingClassId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Academic Structure Setup</h2>
        <button onClick={() => setShowAddYear(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add New Year
        </button>
      </div>

      {/* Add New Year Form */}
      {showAddYear && (
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Add New Academic Year</h3>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year Name</label>
              <input
                type="text"
                value={newYearName}
                onChange={(e) => setNewYearName(e.target.value)}
                placeholder="e.g. 2026-2027"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <button onClick={handleAddYear} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Add</button>
            <button onClick={() => { setShowAddYear(false); setNewYearName(""); }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Academic Years</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Year</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {years.map((year) => (
                <tr key={year.id} className="border-t border-gray-200">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingYearId === year.id ? (
                      <input type="text" value={editYearName} onChange={(e) => setEditYearName(e.target.value)} className="px-2 py-1 border border-gray-300 rounded text-sm w-full" />
                    ) : (
                      year.name
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {year.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingYearId === year.id ? (
                      <>
                        <button onClick={() => saveEditYear(year.id)} className="text-green-600 hover:text-green-800 mr-2"><Check className="h-4 w-4" /></button>
                        <button onClick={() => setEditingYearId(null)} className="text-gray-600 hover:text-gray-800">Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => startEditYear(year)} className="text-blue-600 hover:text-blue-800 mr-2">
                        <Edit2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Terms</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Term</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Year</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Start Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">End Date</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {terms.map((term) => (
                <tr key={term.id} className="border-t border-gray-200">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingTermId === term.id ? (
                      <input type="text" value={editTermName} onChange={(e) => setEditTermName(e.target.value)} className="px-2 py-1 border border-gray-300 rounded text-sm w-full" />
                    ) : (
                      term.name
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{term.year_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {editingTermId === term.id ? (
                      <input type="date" value={editTermStart} onChange={(e) => setEditTermStart(e.target.value)} className="px-2 py-1 border border-gray-300 rounded text-sm" />
                    ) : (
                      term.start_date
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {editingTermId === term.id ? (
                      <input type="date" value={editTermEnd} onChange={(e) => setEditTermEnd(e.target.value)} className="px-2 py-1 border border-gray-300 rounded text-sm" />
                    ) : (
                      term.end_date
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingTermId === term.id ? (
                      <>
                        <button onClick={() => saveEditTerm(term.id)} className="text-green-600 hover:text-green-800 mr-2"><Check className="h-4 w-4" /></button>
                        <button onClick={() => setEditingTermId(null)} className="text-gray-600 hover:text-gray-800">Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => startEditTerm(term)} className="text-blue-600 hover:text-blue-800 mr-2">
                        <Edit2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-900">Classes</h3>
          <button onClick={() => setShowAddClass(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
            <Plus className="h-4 w-4" />
            Add New Class
          </button>
        </div>

        {/* Add New Class Form */}
        {showAddClass && (
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Add New Class</h3>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g. Form 1, S1, Primary 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <button onClick={handleAddClass} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Add</button>
              <button onClick={() => { setShowAddClass(false); setNewClassName(""); }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">Cancel</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <div key={cls.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">
                  {editingClassId === cls.id ? (
                    <input type="text" value={editClassName} onChange={(e) => setEditClassName(e.target.value)} className="px-2 py-1 border border-gray-300 rounded text-sm w-20" />
                  ) : (
                    cls.name
                  )}
                </h4>
                {editingClassId === cls.id ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => saveEditClass(cls.id)} className="text-green-600 hover:text-green-800"><Check className="h-4 w-4" /></button>
                    <button onClick={() => setEditingClassId(null)} className="text-gray-600 hover:text-gray-800 text-xs">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => startEditClass(cls)} className="text-blue-600 hover:text-blue-800">
                    <Edit2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Streams */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-900">Streams</h3>
          <button onClick={() => setShowAddStream(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
            <Plus className="h-4 w-4" />
            Add Stream
          </button>
        </div>

        {/* Add New Stream Form */}
        {showAddStream && (
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Add New Stream</h3>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
                <select
                  value={selectedClassForStream ?? ""}
                  onChange={(e) => setSelectedClassForStream(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">-- Select Class --</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Stream Name</label>
                <input
                  type="text"
                  value={newStreamName}
                  onChange={(e) => setNewStreamName(e.target.value)}
                  placeholder="e.g. A, B, C or East, West"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <button onClick={handleAddStream} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Add</button>
              <button onClick={() => { setShowAddStream(false); setNewStreamName(""); setSelectedClassForStream(null); }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">Cancel</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {streams.map((stream) => (
            <div key={stream.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{stream.name}</h4>
              </div>
              <p className="text-sm text-gray-600">Class: {stream.class?.name || "Unknown"}</p>
            </div>
          ))}
        </div>
        {streams.length === 0 && (
          <p className="text-sm text-gray-500 mt-2">No streams yet. Add streams to each class so teachers can be assigned.</p>
        )}
      </div>

      {/* Subjects */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-900">Subjects</h3>
          <button onClick={() => setShowAddSubject(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
            <Plus className="h-4 w-4" />
            Add New Subject
          </button>
        </div>

        {/* Add New Subject Form */}
        {showAddSubject && (
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Add New Subject</h3>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="e.g. Mathematics, Physics, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <button onClick={handleAddSubject} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Add</button>
              <button onClick={() => { setShowAddSubject(false); setNewSubjectName(""); }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">Cancel</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((sub) => (
            <div key={sub.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{sub.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// B. Subject & Teacher Assignment
function ClassAnalytics() {
  return (
    <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Class Analytics Coming Soon</h3>
      <p className="text-gray-600">This feature is currently under development to provide deep insights into class performance.</p>
    </div>
  );
}

function TeacherAssignment() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<any[]>([]);

  const [classesList, setClassesList] = useState<{id: number, name: string}[]>([]);
  const [subjectsList, setSubjectsList] = useState<{id: number, name: string}[]>([]);

  useEffect(() => {
    academicApi.getClasses().then(res => setClassesList(res.data)).catch(() => {});
    academicApi.getSubjects().then(res => setSubjectsList(res.data)).catch(() => {});
  }, []);

  const [allTeachers, setAllTeachers] = useState<string[]>([]);

  useEffect(() => {
    peopleApi.getTeachers().then(res => {
      setAllTeachers(res.data.map((t: any) => t.user?.full_name || t.name || "Unknown"));
    }).catch(() => {});
  }, []);
  const allStreams = ["A", "B", "C"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Subject & Teacher Assignment</h2>
        <button onClick={() => navigate({ to: "/admin/assign-classes" })} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          New Assignment
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Teacher</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Subject</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Class</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stream</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.id} className="border-t border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-900">{assignment.teacher}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{assignment.subject}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{assignment.class}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{assignment.stream}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => alert(`Edit assignment: ${assignment.teacher} - ${assignment.subject}`)} className="text-blue-600 hover:text-blue-800 mr-2">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setAssignments(assignments.filter(a => a.id !== assignment.id))} className="text-red-600 hover:text-red-800">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// C. Assessment & Grading System
function GradingSystem() {
  const [assessmentTypes] = useState([
    { id: 1, name: "CAT", weight: 40, description: "Continuous Assessment Test" },
    { id: 2, name: "Exam", weight: 60, description: "Final Examination" },
  ]);

  const [gradeScale] = useState([
    { grade: "A", min: 80, max: 100, description: "Excellent" },
    { grade: "B", min: 70, max: 79, description: "Very Good" },
    { grade: "C", min: 60, max: 69, description: "Good" },
    { grade: "D", min: 50, max: 59, description: "Satisfactory" },
    { grade: "E", min: 40, max: 49, description: "Pass" },
    { grade: "F", min: 0, max: 39, description: "Fail" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Assessment & Grading System</h2>
        <button onClick={() => alert("Add Assessment Type feature coming soon!")} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Assessment Type
        </button>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Assessment Types & Weighting</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessmentTypes.map((type) => (
            <div key={type.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{type.name}</h4>
                <span className="text-2xl font-bold text-blue-600">{type.weight}%</span>
              </div>
              <p className="text-sm text-gray-600">{type.description}</p>
              <div className="flex justify-end mt-3">
                <button onClick={() => alert(`Edit assessment type: ${type.name}`)} className="text-blue-600 hover:text-blue-800">
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Grade Scale</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Grade</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Min Score</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Max Score</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gradeScale.map((grade) => (
                <tr key={grade.grade} className="border-t border-gray-200">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold">
                      {grade.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{grade.min}%</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{grade.max}%</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{grade.description}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => alert(`Edit grade: ${grade.grade}`)} className="text-blue-600 hover:text-blue-800">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// D. Marks Management
function MarksManagement() {
  const [showEnterMarks, setShowEnterMarks] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [marks, setMarks] = useState<any[]>([]);

  useEffect(() => {
    peopleApi.getStudents().then(res => {
      setMarks(res.data.map((s: any) => ({
        id: s.id,
        studentId: s.student_id || s.id,
        name: s.user?.full_name || s.full_name || s.name || "Unknown",
        class: s.class_name || s.class?.name || "Unknown",
        cat: 0,
        exam: 0,
        total: 0,
        grade: "N/A"
      })));
    }).catch(err => console.error(err));
  }, []);

  const [editingMarkId, setEditingMarkId] = useState<number | null>(null);
  const [editCat, setEditCat] = useState("");
  const [editExam, setEditExam] = useState("");

  const [classesList, setClassesList] = useState<{id: number, name: string}[]>([]);
  const [subjectsList, setSubjectsList] = useState<{id: number, name: string}[]>([]);

  useEffect(() => {
    academicApi.getClasses().then(res => setClassesList(res.data)).catch(() => {});
    academicApi.getSubjects().then(res => setSubjectsList(res.data)).catch(() => {});
  }, []);

  const allTerms = ["Term 1", "Term 2", "Term 3"];
  const allYears = ["2024-2025", "2025-2026", "2026-2027"];

  const allSelected = selectedClass && selectedSubject && selectedTerm && selectedYear;

  const getGrade = (total: number) => {
    if (total >= 80) return "A";
    if (total >= 70) return "B";
    if (total >= 60) return "C";
    if (total >= 50) return "D";
    if (total >= 40) return "E";
    return "F";
  };

  const startEditMark = (mark: typeof marks[0]) => {
    setEditingMarkId(mark.id);
    setEditCat(mark.cat.toString());
    setEditExam(mark.exam.toString());
  };

  const saveEditMark = (id: number) => {
    const cat = parseInt(editCat) || 0;
    const exam = parseInt(editExam) || 0;
    const total = cat + exam;
    setMarks(marks.map(m => m.id === id ? { ...m, cat, exam, total, grade: getGrade(total) } : m));
    setEditingMarkId(null);
  };

  const handleSaveMarks = () => {
    alert("Marks saved successfully!");
  };

  const handleLockMarks = () => {
    if (window.confirm("Are you sure you want to lock marks? No further changes will be allowed.")) {
      alert("Marks locked successfully!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Marks Management</h2>
        <button onClick={() => setShowEnterMarks(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Enter Marks
        </button>
      </div>

      {/* Enter Marks Selection Form */}
      {showEnterMarks && (
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Select Details to Enter Marks</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
              <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
                <option value="">Select Class</option>
                {classesList.map((cls) => (<option key={cls.id} value={cls.name}>{cls.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
                <option value="">Select Subject</option>
                {subjectsList.map((sub) => (<option key={sub.id} value={sub.name}>{sub.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year *</label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
                <option value="">Select Year</option>
                {allYears.map((yr) => (<option key={yr} value={yr}>{yr}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term *</label>
              <select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
                <option value="">Select Term</option>
                {allTerms.map((term) => (<option key={term} value={term}>{term}</option>))}
              </select>
            </div>
          </div>
          {allSelected && (
            <div className="p-3 bg-blue-100 rounded-lg mb-4">
              <p className="text-sm text-blue-800">
                <strong>Selection:</strong> {selectedClass} | {selectedSubject} | {selectedYear} | {selectedTerm}
              </p>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <button onClick={() => { setShowEnterMarks(false); setSelectedClass(""); setSelectedSubject(""); setSelectedTerm(""); setSelectedYear(""); }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">Cancel</button>
            <button onClick={() => { if (allSelected) setShowEnterMarks(false); }} disabled={!allSelected} className={`px-4 py-2 rounded-lg text-sm ${allSelected ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>Proceed</button>
          </div>
        </div>
      )}

      {/* Filter dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="">Select Class</option>
            {classesList.map((cls) => (<option key={cls.id} value={cls.name}>{cls.name}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="">Select Subject</option>
            {subjectsList.map((sub) => (<option key={sub.id} value={sub.name}>{sub.name}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
          <select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="">Select Term</option>
            {allTerms.map((term) => (<option key={term} value={term}>{term}</option>))}
          </select>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Class</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {marks.map((mark) => (
              <tr key={mark.id} className="border-t border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-900">{mark.studentId}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{mark.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{mark.class}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => alert(`View marks for ${mark.name}`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={handleSaveMarks} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Save className="h-4 w-4" />
          Save Marks
        </button>
        <button onClick={handleLockMarks} className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
          <Check className="h-4 w-4" />
          Lock Marks
        </button>
      </div>
    </div>
  );
}

// E. Attendance Management
function AttendanceManagement() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const [attendance, setAttendance] = useState<any[]>([]);

  useEffect(() => {
    peopleApi.getStudents().then(res => {
      setAttendance(res.data.map((s: any) => ({
        id: s.id,
        studentId: s.student_id || s.id,
        name: s.full_name || s.name,
        class: s.class_name || s.class || "Unknown",
        status: "Present"
      })));
    }).catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Attendance Management</h2>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Take Attendance
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Select Class</option>
            <option value="S1">S1</option>
            <option value="S2">S2</option>
            <option value="S3">S3</option>
          </select>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Class</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((att) => (
              <tr key={att.id} className="border-t border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-900">{att.studentId}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{att.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{att.class}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">Present</p>
          <p className="text-2xl font-bold text-green-900">3</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">Absent</p>
          <p className="text-2xl font-bold text-red-900">1</p>
        </div>
      </div>
    </div>
  );
}

function ProgressiveReports() {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedCombination, setSelectedCombination] = useState("");
  const [reportType, setReportType] = useState("whole-class");
  const [searchStudent, setSearchStudent] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [reportsReady, setReportsReady] = useState(false);

  const years = ["2024-2025", "2025-2026", "2026-2027"];
  const terms = ["Term 1", "Term 2", "Term 3"];
  const classes = ["Form 1", "Form 2", "Form 3", "Form 4", "Form 5", "Form 6"];
  const streams = ["Science", "Commerce", "Arts"];
  const combinations = ["PCB", "PCM", "PCMB", "Commerce", "Arts", "General"];

  const students = [
    { 
      id: 1, 
      name: "Alice Johnson", 
      indexNumber: "F3-001", 
      class: "Form 3", 
      stream: "Science", 
      rank: 2, 
      rankName: "Second Position", 
      average: 87.5, 
      status: "active",
      marks: {
        mathematics: 92,
        physics: 88,
        chemistry: 85,
        biology: 90,
        english: 82
      }
    },
    { 
      id: 2, 
      name: "Brian Smith", 
      indexNumber: "F3-002", 
      class: "Form 3", 
      stream: "Science", 
      rank: 5, 
      rankName: "Fifth Position", 
      average: 82.3, 
      status: "active",
      marks: {
        mathematics: 85,
        physics: 82,
        chemistry: 80,
        biology: 83,
        english: 81
      }
    },
    { 
      id: 3, 
      name: "Carol Davis", 
      indexNumber: "F3-003", 
      class: "Form 3", 
      stream: "Commerce", 
      rank: 8, 
      rankName: "Eighth Position", 
      average: 78.9, 
      status: "active",
      marks: {
        mathematics: 80,
        accounting: 82,
        economics: 78,
        business: 76,
        english: 79
      }
    },
    { 
      id: 4, 
      name: "David Wilson", 
      indexNumber: "F3-004", 
      class: "Form 3", 
      stream: "Arts", 
      rank: 12, 
      rankName: "Twelfth Position", 
      average: 74.2, 
      status: "active",
      marks: {
        history: 76,
        geography: 72,
        literature: 75,
        arts: 73,
        english: 75
      }
    },
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = searchStudent === "" || 
      student.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      student.indexNumber.toLowerCase().includes(searchStudent.toLowerCase());
    const matchesClass = selectedClass === "" || student.class === selectedClass;
    const matchesStream = selectedStream === "" || student.stream === selectedStream;
    // For now, show all students for the selected class regardless of combination
    // In a real system, students would have combination data
    return matchesSearch && matchesClass && matchesStream;
  });

  const generationSteps = [
    { id: 0, name: "Initializing Report Generation", description: "Setting up report parameters and templates" },
    { id: 1, name: "Validating Selection Criteria", description: "Checking year, term, class, and student selections" },
    { id: 2, name: "Fetching Student Records", description: "Retrieving student enrollment and demographic data" },
    { id: 3, name: "Loading Academic Performance", description: "Collecting grades, assessments, and exam results" },
    { id: 4, name: "Calculating Progress Metrics", description: "Computing averages, rankings, and performance trends" },
    { id: 5, name: "Analyzing Subject Performance", description: "Evaluating individual subject progress and areas of improvement" },
    { id: 6, name: "Generating Attendance Summary", description: "Compiling attendance records and punctuality data" },
    { id: 7, name: "Creating Behavior Assessment", description: "Including conduct and disciplinary summaries" },
    { id: 8, name: "Formatting Report Layout", description: "Applying templates and formatting report structure" },
    { id: 9, name: "Adding Teacher Comments", description: "Including subject teacher remarks and recommendations" },
    { id: 10, name: "Generating PDF Documents", description: "Converting reports to printable PDF format" },
    { id: 11, name: "Quality Assurance Check", description: "Verifying data accuracy and report completeness" },
    { id: 12, name: "Preparing Download Package", description: "Organizing reports for printing and distribution" }
  ];

  const handleGenerateReports = () => {
    if (!selectedYear || !selectedTerm || !selectedClass || !selectedCombination) {
      alert("Please select year, term, class, and combination");
      return;
    }

    if (reportType === "individual" && !selectedStudent) {
      alert("Please select a student for individual report");
      return;
    }

    setIsGenerating(true);
    setCurrentStep(0);
    setGenerationProgress(0);

    // Simulate step-by-step generation process
    const steps = [
      { step: 0, duration: 300, progress: 8 },
      { step: 1, duration: 400, progress: 15 },
      { step: 2, duration: 600, progress: 23 },
      { step: 3, duration: 800, progress: 31 },
      { step: 4, duration: 700, progress: 38 },
      { step: 5, duration: 600, progress: 46 },
      { step: 6, duration: 500, progress: 54 },
      { step: 7, duration: 400, progress: 62 },
      { step: 8, duration: 600, progress: 69 },
      { step: 9, duration: 500, progress: 77 },
      { step: 10, duration: 800, progress: 85 },
      { step: 11, duration: 600, progress: 92 },
      { step: 12, duration: 400, progress: 100 }
    ];

    let cumulativeDelay = 0;
    steps.forEach(({ step, duration, progress }) => {
      setTimeout(() => {
        setCurrentStep(step);
        setGenerationProgress(progress);
      }, cumulativeDelay);
      cumulativeDelay += duration;
    });

    setTimeout(() => {
      setIsGenerating(false);
      setCurrentStep(0);
      setGenerationProgress(0);
      setReportsReady(true);
      // Reports generated successfully - page stays open with actions available
    }, cumulativeDelay);
  };

  const handlePrintReports = () => {
    // Create a print-friendly version of the reports
    const printContent = `
      <html>
        <head>
          <title>Progressive Reports - ${selectedYear} ${selectedTerm}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .student-info { margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
            .metrics { display: flex; justify-content: space-between; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Progressive Academic Reports</h1>
            <h2>${selectedYear} - ${selectedTerm}</h2>
            <h3>${selectedClass} - ${selectedCombination} ${selectedStream ? '- ' + selectedStream : ''}</h3>
            <p>Generated: ${new Date().toLocaleDateString()}</p>
          </div>
          ${filteredStudents.map(student => `
            <div class="student-info">
              <h4>${student.name} (${student.indexNumber})</h4>
              <div class="metrics">
                <span>Average: ${student.average}%</span>
                <span>Rank: #${student.rank}</span>
                <span>Status: ${student.status}</span>
              </div>
            </div>
          `).join('')}
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleExportCSV = () => {
    // Create CSV data for the reports
    const csvHeaders = ['Student Name', 'Index Number', 'Class', 'Combination', 'Stream', 'Average', 'Rank', 'Status'];
    const csvData = filteredStudents.map(student => [
      student.name,
      student.indexNumber,
      student.class,
      selectedCombination,
      student.stream,
      student.average,
      student.rank,
      student.status
    ]);
    
    // Convert to CSV format
    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `progressive_reports_${selectedYear}_${selectedTerm}_${selectedClass}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewReport = () => {
    // Navigate to a detailed report view or show report modal
    alert(`Viewing detailed reports for ${selectedClass} - ${selectedCombination} (${selectedYear} ${selectedTerm})\n\nThis would open a comprehensive report view with:\n- Student performance details\n- Subject-wise analysis\n- Class statistics\n- Individual student reports`);
  };

  const handleViewStudentReport = (student: any) => {
    // Create comprehensive student report based on provided structure
    const reportContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Student Progressive Report - ${student.name}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            background: white;
            color: #000;
            line-height: 1.4;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
        }
        .school-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .report-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
        }
        .academic-year {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
        }
        .student-info {
            display: flex;
            gap: 30px;
            margin-bottom: 25px;
            align-items: flex-start;
        }
        .photo-section {
            width: 150px;
            text-align: center;
        }
        .photo-placeholder {
            width: 120px;
            height: 150px;
            border: 2px solid #ccc;
            background: #f9f9f9;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #666;
            margin-bottom: 10px;
        }
        .student-details {
            flex: 1;
        }
        .info-row {
            display: flex;
            margin-bottom: 8px;
            align-items: center;
        }
        .info-label {
            font-weight: bold;
            min-width: 120px;
            color: #333;
        }
        .info-value {
            color: #000;
            font-weight: normal;
        }
        .performance-section {
            margin-bottom: 25px;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }
        .performance-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }
        .perf-item {
            text-align: center;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .perf-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
        }
        .perf-value {
            font-size: 20px;
            font-weight: bold;
            color: #2563eb;
        }
        .subjects-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 12px;
        }
        .subjects-table th {
            background: #f5f5f5;
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
            font-weight: bold;
        }
        .subjects-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
        }
        .subjects-table tr:nth-child(even) {
            background: #f9f9f9;
        }
        .grade-a { color: #28a745; font-weight: bold; }
        .grade-b { color: #ffc107; font-weight: bold; }
        .grade-c { color: #17a2b8; font-weight: bold; }
        .grade-d { color: #dc3545; font-weight: bold; }
        .grade-e { color: #f56342; font-weight: bold; }
        .grade-f { color: #dc2626; font-weight: bold; }
        .comments-section {
            margin-bottom: 20px;
        }
        .comments-box {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 5px;
            padding: 15px;
            min-height: 60px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #ccc;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .signature-section {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .signature-box {
            width: 200px;
        }
        .signature-line {
            border-bottom: 1px solid #333;
            height: 40px;
            margin-bottom: 5px;
            font-size: 11px;
            color: #666;
        }
        .signature-label {
            font-size: 11px;
            color: #666;
        }
        .actions {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
            z-index: 1000;
        }
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
        }
        .btn-print {
            background: #007bff;
            color: white;
        }
        .btn-pdf {
            background: #28a745;
            color: white;
        }
        .btn:hover {
            opacity: 0.8;
        }
        @media print {
            .actions { display: none; }
            body { font-size: 10px; }
            .container { padding: 10px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header Section -->
        <div class="header">
            <div class="school-name">SCHOLAR SPHERE SECONDARY SCHOOL</div>
            <div class="report-title">STUDENT PROGRESSIVE REPORT</div>
            <div class="academic-year">${selectedYear} - ${selectedTerm}</div>
        </div>

        <!-- Student Information Section -->
        <div class="student-info">
            <div class="photo-section">
                <div class="photo-placeholder">
                    STUDENT<br>PHOTO
                </div>
            </div>
            <div class="student-details">
                <div class="info-row">
                    <div class="info-label">Student's Name:</div>
                    <div class="info-value">${student.name}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Class:</div>
                    <div class="info-value">${student.class}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Stream:</div>
                    <div class="info-value">${student.stream}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Sex:</div>
                    <div class="info-value">Male</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Registration Number:</div>
                    <div class="info-value">${student.indexNumber}</div>
                </div>
            </div>
        </div>

        <!-- Performance Summary Section -->
        <div class="performance-section">
            <div class="section-title">PERFORMANCE SUMMARY</div>
            <div class="performance-grid">
                <div class="perf-item">
                    <div class="perf-label">Total Marks</div>
                    <div class="perf-value">${student.average * 10}</div>
                </div>
                <div class="perf-item">
                    <div class="perf-label">Average</div>
                    <div class="perf-value">${student.average}%</div>
                </div>
                <div class="perf-item">
                    <div class="perf-label">Grade</div>
                    <div class="perf-value">${student.average >= 80 ? 'A' : student.average >= 70 ? 'B' : student.average >= 60 ? 'C' : student.average >= 50 ? 'D' : student.average >= 40 ? 'E' : 'F'}</div>
                </div>
            </div>
        </div>

        <!-- Subject Marks Section -->
        <div class="performance-section">
            <div class="section-title">SUBJECT MARKS</div>
            <table class="subjects-table">
                <thead>
                    <tr>
                        <th>SUBJECTS</th>
                        <th>MARKS OBTAINED</th>
                        <th>TOTAL MARKS</th>
                        <th>GRADE</th>
                        <th>REMARKS</th>
                        <th>POSITION</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(student.marks).map(([subject, mark]: [string, any], index) => {
                        let grade, remarks, position: any = '';
                        if (mark >= 80) { grade = 'A'; remarks = 'Excellent'; position = index + 1; }
                        else if (mark >= 70) { grade = 'B'; remarks = 'Very Good'; position = index + 1; }
                        else if (mark >= 60) { grade = 'C'; remarks = 'Good'; position = index + 1; }
                        else if (mark >= 50) { grade = 'D'; remarks = 'Fair'; position = index + 1; }
                        else if (mark >= 40) { grade = 'E'; remarks = 'Poor'; position = index + 1; }
                        else { grade = 'F'; remarks = 'Very Poor'; position = index + 1; }
                        
                        return `
                            <tr>
                                <td>${subject.charAt(0).toUpperCase() + subject.slice(1)}</td>
                                <td>${mark}</td>
                                <td>100</td>
                                <td class="grade-${grade.toLowerCase()}">${grade}</td>
                                <td>${remarks}</td>
                                <td>${position}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>

        <!-- Comments Section -->
        <div class="comments-section">
            <div class="section-title">CLASS TEACHER'S GENERAL COMMENTS</div>
            <div class="comments-box">
                ${student.comment}
            </div>
        </div>

        <!-- Footer Section -->
        <div class="footer">
            <div class="signature-section">
                <div>
                    <div class="signature-label">Prepared by:</div>
                    <div class="signature-line">Academic Office</div>
                </div>
                <div class="signature-box">
                    <div class="signature-label">Signature:</div>
                    <div class="signature-line"></div>
                </div>
            </div>
            <div style="margin-top: 15px; font-size: 11px;">
                Date: ${new Date().toLocaleDateString()}
            </div>
        </div>
    </div>

    <!-- Action Buttons -->
    <div class="actions">
        <button class="btn btn-print" onclick="window.print()">
            🖨️ Print
        </button>
        <button class="btn btn-pdf" onclick="window.print()">
            📄 Generate PDF
        </button>
    </div>
</body>
</html>
    `;
    
    // Generate and download PDF
    const generatePDF = (content: string, studentName: string) => {
        // Create a temporary link element for PDF download
        const link = document.createElement('a');
        link.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(content));
        link.setAttribute('download', `Progressive_Report_${studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Open report in new window and provide PDF option
    const reportWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    if (reportWindow) {
        reportWindow.document.write(reportContent);
        reportWindow.document.close();
        
        // Add PDF generation button in the new window
        setTimeout(() => {
            if (reportWindow.document) {
                const pdfButton = reportWindow.document.createElement('button');
                pdfButton.textContent = '📄 Download PDF';
                pdfButton.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    background: #dc2626;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                    z-index: 1000;
                `;
                pdfButton.onclick = () => generatePDF(reportContent, student.name);
                reportWindow.document.body.appendChild(pdfButton);
            }
        }, 1000);
        
        reportWindow.focus();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Progressive Reports</h1>
          <p className="text-gray-600 mt-2">Generate comprehensive student academic progress reports</p>
        </div>

        
        {/* Generation Progress Steps */}
        {isGenerating && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Reports</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-900">{generationProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-3">
              {generationSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    index < currentStep 
                      ? 'bg-green-500 text-white' 
                      : index === currentStep 
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index < currentStep ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </p>
                    <p className={`text-xs ${
                      index <= currentStep ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                  {index === currentStep && (
                    <div className="flex-shrink-0">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* View Report Action */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reports ready for:</span>
                <div className="flex gap-2">
                  <button 
                    onClick={handleViewReport}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <Eye className="h-3 w-3" />
                    View Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        
        
        {/* Top Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              placeholder="Search by name, ID, or class..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 ${showFilters ? "bg-blue-50 border-blue-300" : ""}`}
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Academic Year *</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Term *</label>
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Terms</option>
                  {terms.map((term) => (
                    <option key={term} value={term}>{term}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Class *</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Classes</option>
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Combination *</label>
                <select
                  value={selectedCombination}
                  onChange={(e) => setSelectedCombination(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Combinations</option>
                  {combinations.map((combo) => (
                    <option key={combo} value={combo}>{combo}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Stream</label>
                <select
                  value={selectedStream}
                  onChange={(e) => setSelectedStream(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Streams</option>
                  {streams.map((stream) => (
                    <option key={stream} value={stream}>{stream}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="whole-class">Whole Class</option>
                  <option value="individual">Individual Student</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Student List or Generated Reports - Shows based on reportsReady state */}
        {selectedClass && !reportsReady && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Students in {selectedClass}</h3>
              <p className="text-sm text-gray-600">
                {selectedStream ? `Stream ${selectedStream}` : "All streams"} • {filteredStudents.length} students
              </p>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredStudents
                .filter(student => selectedStream ? student.stream === selectedStream : true)
                .map((student) => (
                  <div key={student.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <span className="font-medium text-gray-900">{student.indexNumber}</span>
                            <h4 className="font-medium text-gray-900">{student.name}</h4>
                            <span className="text-sm text-gray-600">{student.class}</span>
                            {selectedStream && <span className="text-sm text-gray-500">• {student.stream}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {filteredStudents.filter(student => selectedStream ? student.stream === selectedStream : true).length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
                <p className="text-gray-600">No students found in {selectedClass} {selectedStream ? `stream ${selectedStream}` : ""}</p>
              </div>
            )}
            
            {/* Generate Reports Button Under List */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Ready to generate reports for {filteredStudents.filter(student => selectedStream ? student.stream === selectedStream : true).length} students
                </span>
                <button
                  onClick={handleGenerateReports}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Generate Reports
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Generated Reports List - Shows after generation is complete */}
        {selectedClass && reportsReady && !isGenerating && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="bg-green-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-green-900">Generated Reports - {selectedClass}</h3>
              <p className="text-sm text-green-700">
                {selectedYear} {selectedTerm} • {selectedCombination} • {filteredStudents.filter(student => selectedStream ? student.stream === selectedStream : true).length} reports ready
              </p>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredStudents
                .filter(student => selectedStream ? student.stream === selectedStream : true)
                .sort((a, b) => a.rank - b.rank)
                .map((student) => (
                  <div key={student.id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        {/* Rank Badge */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          student.rank === 1 ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' :
                          student.rank === 2 ? 'bg-gray-100 text-gray-800 border-2 border-gray-300' :
                          student.rank === 3 ? 'bg-orange-100 text-orange-800 border-2 border-orange-300' :
                          'bg-blue-50 text-blue-700 border-2 border-blue-200'
                        }`}>
                          #{student.rank}
                        </div>
                        
                        {/* Student Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{student.name}</h4>
                            <span className="text-sm text-gray-500">({student.indexNumber})</span>
                            <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                              {student.rankName}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-600">{student.class}</span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-600">{selectedCombination}</span>
                            {selectedStream && (
                              <>
                                <span className="text-sm text-gray-400">•</span>
                                <span className="text-sm text-gray-600">{student.stream}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Performance Metrics */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-semibold text-blue-600">{student.average}%</div>
                          <div className="text-xs text-gray-500">Average</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            student.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {student.status}
                          </span>
                        </div>
                        <button 
                          onClick={() => {
                            // Create individual student report card for printing
                            const studentReportCard = `
<!DOCTYPE html>
<html>
<head>
    <title>Student Report Card - ${student.name}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            background: white;
            width: 100%;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .report-card {
            width: 400px;
            height: 280px;
            border: 3px solid #333;
            border-radius: 10px;
            padding: 20px;
            background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            position: relative;
        }
        .school-header {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .school-name {
            font-size: 16px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 5px;
        }
        .report-title {
            font-size: 12px;
            color: #666;
        }
        .student-info {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
        }
        .info-item {
            flex: 1;
        }
        .info-label {
            font-size: 10px;
            font-weight: bold;
            color: #333;
            margin-bottom: 2px;
        }
        .info-value {
            font-size: 11px;
            color: #000;
        }
        .performance-section {
            margin-bottom: 15px;
        }
        .performance-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        .perf-item {
            text-align: center;
            padding: 8px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 5px;
        }
        .perf-label {
            font-size: 9px;
            color: #666;
            margin-bottom: 3px;
            font-weight: bold;
        }
        .perf-value {
            font-size: 16px;
            font-weight: bold;
            color: #2563eb;
        }
        .grade-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 15px;
            font-size: 10px;
            font-weight: bold;
        }
        .grade-a { background: #28a745; color: white; }
        .grade-b { background: #f59e0b; color: white; }
        .grade-c { background: #fbbf24; color: white; }
        .grade-d { background: #f87171; color: white; }
        .grade-e { background: #ef4444; color: white; }
        .grade-f { background: #dc2626; color: white; }
        .footer {
            position: absolute;
            bottom: 10px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9px;
            color: #666;
        }
        .signature-label {
            font-size: 11px;
            color: #666;
        }
        .signature {
            font-style: italic;
            border-top: 1px solid #333;
            padding-top: 5px;
            margin-top: 10px;
            width: 150px;
        }
        @media print {
            body { 
                background: white !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            .report-card { 
                box-shadow: none !important;
                border: 2px solid #000 !important;
                page-break-after: always;
            }
            /* Hide all non-essential elements when printing */
            .school-header,
            .report-title,
            .student-info,
            .performance-section,
            .footer {
                display: none !important;
            }
            /* Show only essential report content */
            .student-info {
                display: block !important;
                margin-bottom: 20px !important;
            }
            .performance-grid {
                display: grid !important;
                grid-template-columns: 1fr 1fr !important;
                gap: 15px !important;
                margin-bottom: 20px !important;
            }
            .perf-item {
                text-align: center !important;
                padding: 15px !important;
                background: #f8fafc !important;
                border: 1px solid #e2e8f0 !important;
                border-radius: 5px !important;
            }
            .perf-label {
                font-size: 12px !important;
                color: #333 !important;
                margin-bottom: 8px !important;
                font-weight: bold !important;
            }
            .perf-value {
                font-size: 20px !important;
                font-weight: bold !important;
                color: #2563eb !important;
            }
            .grade-badge {
                display: inline-block !important;
                padding: 6px 12px !important;
                border-radius: 20px !important;
                font-size: 14px !important;
                font-weight: bold !important;
            }
            .footer {
                display: block !important;
                text-align: center !important;
                margin-top: 30px !important;
                padding-top: 20px !important;
                border-top: 2px solid #333 !important;
            }
            .signature {
                display: block !important;
                font-style: italic !important;
                border-top: 2px solid #333 !important;
                padding-top: 10px !important;
                margin-top: 20px !important;
                width: 200px !important;
                margin: 0 auto !important;
            }
            .signature-label {
                display: block !important;
                font-size: 12px !important;
                color: #666 !important;
                margin-bottom: 5px !important;
            }
        }
    </style>
</head>
<body>
    <div class="report-card">
        <div class="school-header">
            <div class="school-name">SCHOLAR SPHERE SECONDARY SCHOOL</div>
            <div class="report-title">STUDENT PROGRESSIVE REPORT CARD</div>
        </div>
        
        <div class="student-info">
            <div class="info-item">
                <div class="info-label">NAME:</div>
                <div class="info-value">${student.name}</div>
            </div>
            <div class="info-item">
                <div class="info-label">CLASS:</div>
                <div class="info-value">${student.class}</div>
            </div>
            <div class="info-item">
                <div class="info-label">STREAM:</div>
                <div class="info-value">${student.stream}</div>
            </div>
            <div class="info-item">
                <div class="info-label">ID NO:</div>
                <div class="info-value">${student.indexNumber}</div>
            </div>
        </div>
        
        <div class="performance-section">
            <h4 style="text-align: center; margin-bottom: 10px; color: #333; font-size: 12px; font-weight: bold;">ACADEMIC PERFORMANCE</h4>
            <div class="performance-grid">
                <div class="perf-item">
                    <div class="perf-label">AVERAGE</div>
                    <div class="perf-value">${student.average}%</div>
                </div>
                <div class="perf-item">
                    <div class="perf-label">GRADE</div>
                    <div class="grade-badge grade-${student.average >= 80 ? 'a' : student.average >= 70 ? 'b' : student.average >= 60 ? 'c' : student.average >= 50 ? 'd' : student.average >= 40 ? 'e' : 'f'}">
                        ${student.average >= 80 ? 'A' : student.average >= 70 ? 'B' : student.average >= 60 ? 'C' : student.average >= 50 ? 'D' : student.average >= 40 ? 'E' : 'F'}
                    </div>
                </div>
                <div class="perf-item">
                    <div class="perf-label">RANK</div>
                    <div class="perf-value">#${student.rank}</div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <div class="signature-label">Academic Office</div>
            <div class="signature">Academic Office</div>
        </div>
    </div>
</body>
</html>
                            `;
                            
                            // Open report card in new window and print
                            const reportCardWindow = window.open('', '_blank', 'width=450,height=350,scrollbars=no,resizable=no');
                            if (reportCardWindow) {
                                reportCardWindow.document.write(studentReportCard);
                                reportCardWindow.document.close();
                                reportCardWindow.focus();
                                // Auto print after short delay
                                setTimeout(() => {
                                    reportCardWindow.print();
                                }, 500);
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          <Printer className="h-3 w-3" />
                          Print
                        </button>
                      </div>
                    </div>
                    
                                        
                                      </div>
                ))}
            </div>
            
            {/* Action Buttons Under Generated Reports */}
            <div className="bg-green-50 px-4 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">
                  {filteredStudents.filter(student => selectedStream ? student.stream === selectedStream : true).length} reports generated successfully
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <Printer className="h-3 w-3" />
                    Print
                  </button>
                  <button 
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    <Download className="h-3 w-3" />
                    Export CSV
                  </button>
                  <button 
                    onClick={() => {
                      const reportsData = filteredStudents
                        .filter(student => selectedStream ? student.stream === selectedStream : true)
                        .map(student => ({
                          'Student Name': student.name,
                          'ID': student.indexNumber,
                          'Class': student.class,
                          'Average': student.average,
                          'Rank': student.rank
                        }));
                      
                      const csvContent = [
                        Object.keys(reportsData[0]).join(','),
                        ...reportsData.map(row => Object.values(row).join(','))
                      ].join('\n');
                      
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `student_reports_${selectedClass}_${selectedYear}_${selectedTerm}.csv`;
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                  <button 
                    onClick={() => setReportsReady(false)}
                    className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    <Filter className="h-3 w-3" />
                    Generate New
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
              </div>
    </div>
  );
}

// H. Discipline Management
function DisciplineManagement() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [points, setPoints] = useState('');
  const [category, setCategory] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    import('@/lib/api').then(({ peopleApi }) => {
      peopleApi.getStudents().then(res => setStudents(res.data)).catch(console.error);
    });
  }, []);

  const filtered = students.filter(s =>
    (s.full_name || s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.student_id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeduct = async () => {
    if (!points || !category || !reason) {
      alert('Please fill in Points, Category, and Reason.');
      return;
    }
    setIsSubmitting(true);
    try {
      const { disciplineApi } = await import('@/lib/api');
      await disciplineApi.deductMarks({
        student_id: selectedStudent.id,
        points: parseInt(points),
        reason,
        category,
        date,
      });
      alert(`✅ ${points} marks deducted from ${selectedStudent.full_name || selectedStudent.name}. Parent notified.`);
      setShowModal(false);
      setSelectedStudent(null);
      setPoints(''); setCategory(''); setReason('');
    } catch {
      alert('❌ Failed to process deduction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Discipline Management</h2>
        <p className="text-sm text-gray-500">Select a student to deduct marks for indiscipline. Parent will be notified automatically.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by name or index..."
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Class</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-sm text-gray-400">
                  {students.length === 0 ? 'Loading students...' : 'No students match your search.'}
                </td>
              </tr>
            ) : filtered.map(student => (
              <tr key={student.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">{student.full_name || student.name}</p>
                  <p className="text-xs text-gray-500">{student.student_id || `#${student.id}`}</p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{student.class_name || student.class || 'N/A'}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => { setSelectedStudent(student); setShowModal(true); }}
                    className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Deduct Marks
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Deduct Marks</h3>
                <p className="text-sm text-gray-500 mt-0.5">{selectedStudent.full_name || selectedStudent.name} — {selectedStudent.student_id}</p>
                {selectedStudent.parent_name && (
                  <p className="text-xs text-orange-600 mt-0.5">Parent: {selectedStudent.parent_name} — will be notified</p>
                )}
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Points to Deduct *</label>
                  <input type="number" value={points} onChange={e => setPoints(e.target.value)} min="1" max="100" placeholder="e.g. 5"
                    className="w-full rounded-lg border border-red-300 px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Violation Category *</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="">Select category...</option>
                  <option>Punctuality &amp; Lateness</option>
                  <option>Uniform &amp; Appearance</option>
                  <option>Academic Honesty</option>
                  <option>Property Misuse</option>
                  <option>Behavioral Conduct</option>
                  <option>Device Violation</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Incident Report *</label>
                <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="Describe the incident..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs text-orange-700">
                ⚠️ This will deduct <strong>{points || '?'}</strong> marks from the student's record and notify their parent.
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleDeduct} disabled={isSubmitting}
                className="px-6 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
                {isSubmitting ? 'Processing...' : 'Confirm & Notify Parent'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
