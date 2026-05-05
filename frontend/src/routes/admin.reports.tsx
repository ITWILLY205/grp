import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, AlertTriangle, BookOpen, Download, Calendar, TrendingUp, TrendingDown, BarChart3, PieChart, Activity, CheckCircle, XCircle, Clock, FileText, GraduationCap, Plus, Filter, RefreshCw, FileCode, Printer, ArrowRight, UserPlus, MessageSquare, Save } from "lucide-react";
import { logReportGenerate, logExportData } from "@/utils/auditLog";

export const Route = createFileRoute("/admin/reports")({
  component: AdminReports,
});

type ReportModule = "attendance" | "discipline" | "academic" | "financial" | "general";

function AdminReports() {
  const [activeModule, setActiveModule] = useState<ReportModule>("attendance");

  const modules = [
    { id: "attendance" as ReportModule, label: "Attendance Reports", icon: Users, description: "Track student attendance patterns" },
    { id: "discipline" as ReportModule, label: "Discipline Reports", icon: AlertTriangle, description: "Monitor student behavior" },
    { id: "academic" as ReportModule, label: "Academic Reports", icon: BookOpen, description: "Analyze student performance" },
    { id: "financial" as ReportModule, label: "Financial Reports", icon: BarChart3, description: "School financial overview" },
    { id: "general" as ReportModule, label: "General Reports", icon: FileText, description: "School-wide statistics" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-7xl mx-auto px-6 pt-8 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Reports</h1>
          <p className="text-gray-600 mt-2">View and generate various school reports</p>
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
          {activeModule === "attendance" && <AttendanceReports />}
          {activeModule === "discipline" && <DisciplineReports />}
          {activeModule === "academic" && <AcademicReports />}
          {activeModule === "financial" && <FinancialReports />}
          {activeModule === "general" && <GeneralReports setActiveModule={setActiveModule} />}
        </div>
      </div>
    </div>
  );
}

// Attendance Reports Module
function AttendanceReports() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const classes = ["S1", "S2", "S3", "S4", "S5", "S6"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Attendance Reports</h2>
        <button
          onClick={() => {
            logReportGenerate("Admin User", "admin", "Attendance", "School Attendance Report", { reportType: "attendance" });
            logExportData("Admin User", "admin", "Attendance Report", "PDF", 0);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">Total Students</p>
          <p className="text-2xl font-bold text-blue-900">25</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">Present</p>
          <p className="text-2xl font-bold text-green-900">23</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">Absent</p>
          <p className="text-2xl font-bold text-red-900">2</p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Time</th>
            </tr>
          </thead>
          <tbody>
            {["John Smith", "Mary Johnson", "James Wilson", "Sarah Brown", "Michael Davis"].map((name, idx) => (
              <tr key={idx} className="border-t border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-900">{name}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    idx < 2 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {idx < 2 ? "Present" : "Absent"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{idx < 2 ? `8:${5 + idx * 5} AM` : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Discipline Reports Module
function DisciplineReports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Discipline Reports</h2>
        <button
          onClick={() => {
            logReportGenerate("Admin User", "admin", "Discipline", "School Discipline Report", { reportType: "discipline" });
            logExportData("Admin User", "admin", "Discipline Report", "PDF", 0);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700">Total Incidents</p>
          <p className="text-2xl font-bold text-yellow-900">12</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">Resolved</p>
          <p className="text-2xl font-bold text-green-900">8</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">Pending</p>
          <p className="text-2xl font-bold text-red-900">4</p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { student: "John Doe", type: "Late arrival", date: "2026-04-15", status: "Resolved" },
              { student: "Jane Smith", type: "Uniform violation", date: "2026-04-14", status: "Pending" },
              { student: "Mike Johnson", type: "Disruptive behavior", date: "2026-04-13", status: "Resolved" },
            ].map((incident, idx) => (
              <tr key={idx} className="border-t border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-900">{incident.student}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{incident.type}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{incident.date}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    incident.status === "Resolved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {incident.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Academic Reports Module
function AcademicReports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Academic Reports</h2>
        <button
          onClick={() => {
            logReportGenerate("Admin User", "admin", "Academic", "School Academic Report", { reportType: "academic" });
            logExportData("Admin User", "admin", "Academic Report", "PDF", 0);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">Total Students</p>
          <p className="text-2xl font-bold text-green-900">245</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">Average Grade</p>
          <p className="text-2xl font-bold text-blue-900">B+</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-700">Top Performers</p>
          <p className="text-2xl font-bold text-purple-900">45</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-700">Need Improvement</p>
          <p className="text-2xl font-bold text-orange-900">18</p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Subject</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Average</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Pass Rate</th>
            </tr>
          </thead>
          <tbody>
            {[
              { subject: "Mathematics", average: "B+", passRate: "88%" },
              { subject: "English", average: "A-", passRate: "92%" },
              { subject: "Science", average: "B", passRate: "85%" },
              { subject: "History", average: "B+", passRate: "90%" },
            ].map((subj, idx) => (
              <tr key={idx} className="border-t border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-900">{subj.subject}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{subj.average}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{subj.passRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Financial Reports Module
function FinancialReports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Financial Reports</h2>
        <button
          onClick={() => {
            logReportGenerate("Admin User", "admin", "Financial", "School Financial Report", { reportType: "financial" });
            logExportData("Admin User", "admin", "Financial Report", "PDF", 0);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">Total Revenue</p>
          <p className="text-2xl font-bold text-green-900">$125,000</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">Total Expenses</p>
          <p className="text-2xl font-bold text-blue-900">$85,000</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-700">Net Profit</p>
          <p className="text-2xl font-bold text-purple-900">$40,000</p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Financial Analytics</h3>
        <p className="text-gray-600">Select a date range to view detailed financial reports</p>
      </div>
    </div>
  );
}

// General Reports Module
function GeneralReports({ setActiveModule }: { setActiveModule?: React.Dispatch<React.SetStateAction<ReportModule>> }) {
  const [year, setYear] = useState("2026");
  const [term, setTerm] = useState("2");
  const [dateRange, setDateRange] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState<{date: string; content: string}[]>([
    { date: "2026-04-28 10:00", content: "Attendance has shown improvement in Term 2." }
  ]);

  const handleGenerate = () => {
    setIsGenerating(true);
    window.history.pushState({}, '', `?year=${year}&term=${term}${dateRange ? `&date=${dateRange}` : ''}`);
    setTimeout(() => {
      setIsGenerating(false);
      logReportGenerate("Admin User", "admin", "General", "School General Report", { reportType: "general", year, term });
    }, 800);
  };

  const handleReset = () => {
    setYear("2026");
    setTerm("2");
    setDateRange("");
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleAddNote = () => {
    if (note.trim()) {
      setSavedNotes([...savedNotes, { date: new Date().toLocaleString(), content: note }]);
      setNote("");
    }
  };

  const handleExport = (type: string) => {
    alert(`Exporting to ${type}... Initiating download.`);
    logExportData("Admin User", "admin", `General Report ${type}`, type, 0);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
            <select value={year} onChange={(e)=>setYear(e.target.value)} className="w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
            <select value={term} onChange={(e)=>setTerm(e.target.value)} className="w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
              <option value="1">Term 1</option>
              <option value="2">Term 2</option>
              <option value="3">Term 3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Date</label>
            <input type="date" value={dateRange} onChange={(e)=>setDateRange(e.target.value)} className="w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleGenerate} className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg text-sm font-medium flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Apply
            </button>
            <button onClick={handleReset} className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium">
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => handleExport('PDF')} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
            <FileText className="h-4 w-4 text-red-600" /> Export PDF
          </button>
          <button onClick={() => handleExport('Excel')} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
            <FileCode className="h-4 w-4 text-green-600" /> Export Excel
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
            <Printer className="h-4 w-4 text-gray-600" /> Print
          </button>
        </div>
      </div>

      {isGenerating ? (
         <div className="h-64 flex flex-col items-center justify-center space-y-4 border border-gray-200 rounded-lg bg-gray-50">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
           <p className="text-gray-500 text-sm font-medium">Compiling report data...</p>
         </div>
      ) : (
        <div className="space-y-6">
          {/* Key Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <h4 className="text-sm font-semibold text-red-900">Unpaid Fees Focus</h4>
                </div>
                <p className="text-sm text-red-700 mb-3">45 students have critical overdue balances.</p>
              </div>
              <button onClick={() => setActiveModule?.('financial')} className="text-sm font-medium text-red-600 hover:text-red-800 self-start">Review Finance &rarr;</button>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex flex-col justify-between">
              <div>
                 <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <h4 className="text-sm font-semibold text-yellow-900">Attendance Drop</h4>
                 </div>
                 <p className="text-sm text-yellow-700 mb-3">Form 3 avg dropped to 82% this week.</p>
              </div>
              <button onClick={() => setActiveModule?.('attendance')} className="text-sm font-medium text-yellow-600 hover:text-yellow-800 self-start">Investigate &rarr;</button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col justify-between">
              <div>
                 <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-blue-600" />
                  <h4 className="text-sm font-semibold text-blue-900">Science Exams</h4>
                 </div>
                 <p className="text-sm text-blue-700 mb-3">Science average pass rate fell by 5%.</p>
              </div>
              <button onClick={() => setActiveModule?.('academic')} className="text-sm font-medium text-blue-600 hover:text-blue-800 self-start">View Academic &rarr;</button>
            </div>
          </div>

          {/* School Overview Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">School Overview</h3>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Teachers</p>
                  <p className="text-2xl font-bold text-gray-900">68</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Classes</p>
                  <p className="text-2xl font-bold text-gray-900">36</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700 mb-1">Attendance Rate</p>
                  <p className="text-2xl font-bold text-green-900">94.2%</p>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <p className="text-sm text-indigo-700 mb-1">Fee Collection</p>
                  <p className="text-2xl font-bold text-indigo-900">86.0%</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enrollment Summary */}
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Enrollment Breakdowns</h3>
                <button onClick={() => window.location.href = '/admin/students'} className="text-sm text-blue-600 font-medium hover:underline">View All</button>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">Total</p>
                  <p className="font-bold text-gray-900 text-lg">1,247</p>
                </div>
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-center">
                  <p className="text-xs text-green-700 mb-1">New</p>
                  <p className="font-bold text-green-900 text-lg">+124</p>
                </div>
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-center">
                  <p className="text-xs text-red-700 mb-1">Withdrawals</p>
                  <p className="font-bold text-red-900 text-lg">-12</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-2 font-medium">Monthly Admission Trend</p>
                <div className="flex items-end justify-between h-16 w-full pt-2">
                   {[20, 45, 30, 80, 55, 90].map((h, i) => (
                    <div key={i} className="w-[12%] bg-blue-400 rounded-t-sm" style={{height: `${(h/100)*100}%`}}></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Finance Overview</h3>
                <button onClick={() => setActiveModule?.('financial')} className="text-sm text-blue-600 font-medium hover:underline">View Defaulters</button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-sm text-green-700 mb-1">Collected</p>
                  <p className="text-xl font-bold text-green-900">$125,000</p>
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-sm text-red-700 mb-1">Outstanding</p>
                  <p className="text-xl font-bold text-red-900">$18,450</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2 flex justify-between">
                  <span>Payment Distribution</span>
                  <span className="font-medium">86% Overall</span>
                </p>
                <div className="w-full bg-red-200 rounded-full h-2.5 flex overflow-hidden">
                  <div className="bg-green-500 h-full" style={{width: '60%'}}></div>
                  <div className="bg-yellow-400 h-full" style={{width: '26%'}}></div>
                  <div className="bg-red-500 h-full" style={{width: '14%'}}></div>
                </div>
              </div>
            </div>
            
            {/* Academic Summary */}
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Academic Stats</h3>
                <button onClick={() => setActiveModule?.('academic')} className="text-sm text-blue-600 font-medium hover:underline">Full Results</button>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-center">
                  <p className="text-xs text-blue-700 mb-1">Avg Score</p>
                  <p className="font-bold text-blue-900 text-lg">74%</p>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg text-center">
                  <p className="text-xs text-indigo-700 mb-1">Pass Rate</p>
                  <p className="font-bold text-indigo-900 text-lg">88%</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg text-center">
                  <p className="text-xs text-purple-700 mb-1">Top Class</p>
                  <p className="font-bold text-purple-900 text-lg">F4A</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2 mt-4">
                 <div className="flex justify-between text-sm text-gray-600">
                   <span>A-B Range Students</span><span>45%</span>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-blue-600 h-1.5 rounded-full" style={{width:'45%'}}></div></div>
              </div>
            </div>

            {/* Attendance Summary */}
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Attendance Insight</h3>
                <button onClick={() => setActiveModule?.('attendance')} className="text-sm text-blue-600 font-medium hover:underline">Full Report</button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-lg">
                  <p className="text-sm text-cyan-700 mb-1">Weekly Avg</p>
                  <p className="text-xl font-bold text-cyan-900">94.2%</p>
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-sm text-red-700 mb-1">Daily Absent</p>
                  <p className="text-xl font-bold text-red-900">24</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                 <p className="text-xs text-gray-500 mb-2 font-medium">Recent 10 Days Trend</p>
                 <div className="flex items-end justify-between h-8 w-full gap-1">
                   {[95,96,94,88,92,97,95,94,92,96].map((p,i) => (
                    <div key={i} className={`w-full rounded-sm ${p<90 ? 'bg-red-400':'bg-cyan-500'}`} style={{height: `${p}%`}}></div>
                  ))}
                 </div>
              </div>
            </div>
          </div>

          {/* Report Notes */}
          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Report Notes</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 min-h-[4rem] max-h-48 overflow-y-auto space-y-3">
              {savedNotes.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No notes added yet.</p>
              ) : (
                savedNotes.map((n, i) => (
                  <div key={i} className="bg-white p-3 rounded border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-blue-600 mb-1">{n.date}</p>
                    <p className="text-sm text-gray-800">{n.content}</p>
                  </div>
                ))
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="text" 
                value={note}
                onChange={(e)=>setNote(e.target.value)}
                placeholder="Add a remark for this report period..." 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              />
              <button 
                onClick={handleAddNote}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}

export default AdminReports;
