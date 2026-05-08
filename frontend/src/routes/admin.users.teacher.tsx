import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { 
  Search, 
  Plus, 
  Upload, 
  Download, 
  Filter, 
  User, 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical, 
  ChevronDown, 
  BookOpen, 
  Mail, 
  Phone, 
  Calendar,
  X,
  Shield,
  Key,
  Ban,
  CheckCircle,
  FileText,
  MapPin,
  Briefcase,
  Lock,
  Unlock,
  AlertTriangle
} from "lucide-react";
import { toggleUserBlock, loadSettings } from "@/lib/settingsStore";

export const Route = createFileRoute("/admin/users/teacher")({
  component: AdminTeachers,
});

// --- Mock Data ---
interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  status: "Active" | "Inactive";
  qualification: string;
  experience: string;
  gender: "Male" | "Female";
  joinDate: string;
  address: string;
  nationalId: string;
  department: string;
}

const initialTeachers: Teacher[] = [
  {
    id: "TCH-001",
    name: "Sarah Chen",
    email: "schen@sms.com",
    phone: "+1 234 567 8901",
    subjects: ["Mathematics", "Physics"],
    classes: ["Form 4A", "Form 5B"],
    status: "Active",
    qualification: "M.Sc. Education",
    experience: "12 Years",
    gender: "Female",
    joinDate: "2021-08-15",
    address: "123 Maple St, North Wing",
    nationalId: "ID-8822-XX",
    department: "Science"
  },
  {
    id: "TCH-002",
    name: "Michael Miller",
    email: "mmiller@sms.com",
    phone: "+1 234 567 8902",
    subjects: ["Biology", "Chemistry"],
    classes: ["Form 3C", "Form 4B"],
    status: "Active",
    qualification: "B.Sc. Biology",
    experience: "8 Years",
    gender: "Male",
    joinDate: "2022-01-20",
    address: "45 Oak Lane, West District",
    nationalId: "ID-9933-YY",
    department: "Science"
  },
  {
    id: "TCH-003",
    name: "Alice Johnson",
    email: "alice@sms.com",
    phone: "+1 234 567 8903",
    subjects: ["English Literature", "History"],
    classes: ["Form 1A", "Form 2A"],
    status: "Inactive",
    qualification: "Ph.D. Literature",
    experience: "15 Years",
    gender: "Female",
    joinDate: "2019-09-10",
    address: "78 Pine Cres, East Hill",
    nationalId: "ID-7711-ZZ",
    department: "Humanities"
  }
];

type ViewMode = "list" | "add" | "profile" | "assign" | "schedule" | "resetPassword";

export function AdminTeachers() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Filters
  const [filterSubject, setFilterSubject] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const subjectsList = ["Mathematics", "Physics", "Biology", "Chemistry", "English Literature", "History"];
  const statuses = ["Active", "Inactive"];

  const filteredTeachers = useMemo(() => {
    return initialTeachers.filter((t) => {
      const matchesSearch = searchTerm === "" || 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = filterSubject === "" || t.subjects.includes(filterSubject);
      const matchesStatus = filterStatus === "" || t.status === filterStatus;
      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [searchTerm, filterSubject, filterStatus]);

  const handleToggleDropdown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleViewProfile = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setViewMode("profile");
    setActiveDropdown(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Teachers</h1>
            <p className="text-gray-600 mt-2">View details and control faculty permissions</p>
          </div>
          {viewMode !== "list" && (
            <button 
              onClick={() => {
                if (viewMode === "assign" || viewMode === "schedule" || viewMode === "resetPassword") {
                  setViewMode("profile");
                } else {
                  setViewMode("list");
                }
              }}
              className="px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2 transition-all active:scale-95"
            >
              ← {viewMode === "assign" || viewMode === "schedule" || viewMode === "resetPassword" ? "Back to Profile" : "Back to List"}
            </button>
          )}
        </div>

        {viewMode === "list" && (
          <>
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, ID, or subject..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("add")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Teacher
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
              <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 mb-8 animate-in slide-in-from-top-4 duration-300 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Subject Expertise</label>
                    <select
                      value={filterSubject}
                      onChange={(e) => setFilterSubject(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="">All Subjects</option>
                      {subjectsList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Deployment Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="">All Statuses</option>
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Teachers Table */}
            <div className="bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-blue-900/5 overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Faculty Member</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ID System</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Communication</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Assignments</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Access</th>
                    <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium">
                  {filteredTeachers.map((teacher) => (
                    <tr 
                      key={teacher.id} 
                      className="group hover:bg-blue-50/40 transition-all cursor-pointer"
                      onClick={() => handleViewProfile(teacher)}
                    >
                      <td className="px-6 py-6 transition-all group-hover:pl-8">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-all">
                            <span className="text-white font-black text-xs">
                              {teacher.name.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900 leading-none mb-1">{teacher.name}</p>
                            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tight">{teacher.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg border border-gray-200">
                           {teacher.id}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1.5">
                          <span className="flex items-center gap-2 text-xs text-gray-600"><Mail className="w-3.5 h-3.5 text-blue-400"/> {teacher.email}</span>
                          <span className="flex items-center gap-2 text-xs text-gray-500"><Phone className="w-3.5 h-3.5 text-gray-400"/> {teacher.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-wrap gap-1.5">
                          {teacher.subjects.slice(0, 2).map(s => (
                            <span key={s} className="px-2.5 py-1 bg-white text-gray-700 rounded-xl text-[10px] font-black border border-gray-100 shadow-sm">{s}</span>
                          ))}
                          {teacher.subjects.length > 2 && (
                            <span className="text-[10px] text-blue-500 font-black pl-1">+{teacher.subjects.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${teacher.status === "Active" ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                           <span className={`text-[10px] font-black uppercase tracking-widest ${
                           teacher.status === "Active" ? "text-green-700" : "text-red-700"
                           }`}>
                           {teacher.status}
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right relative" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={(e) => handleToggleDropdown(e, teacher.id)}
                          className="p-2.5 hover:bg-white hover:shadow-md rounded-xl transition-all ml-auto flex items-center justify-center border border-transparent hover:border-gray-100"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </button>
                        {activeDropdown === teacher.id && (
                          <div className="absolute right-6 mt-2 w-56 bg-white border border-gray-100 rounded-3xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <button 
                                onClick={() => handleViewProfile(teacher)}
                                className="w-full text-left px-5 py-3.5 text-xs font-black text-gray-700 hover:bg-blue-50 flex items-center gap-3 transition-colors"
                            >
                              <div className="w-7 h-7 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600"><Eye className="h-4 w-4" /></div> Profile & Security
                            </button>
                            <button 
                                className="w-full text-left px-5 py-3.5 text-xs font-black text-gray-700 hover:bg-amber-50 flex items-center gap-3 transition-colors"
                            >
                              <div className="w-7 h-7 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600"><Edit className="h-4 w-4" /></div> Edit Credentials
                            </button>
                            <div className="border-t border-gray-50">
                                <button 
                                    onClick={() => { if(confirm(`Delete ${teacher.name}?`)) alert("Deleted"); setActiveDropdown(null); }}
                                    className="w-full text-left px-5 py-3.5 text-xs font-black text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                >
                                  <div className="w-7 h-7 bg-red-100 rounded-xl flex items-center justify-center text-red-600"><Trash2 className="h-4 w-4" /></div> Purge Record
                                </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTeachers.length === 0 && (
                <div className="p-20 text-center">
                   <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                      <Search className="w-8 h-8 text-gray-300" />
                   </div>
                   <h3 className="text-xl font-black text-gray-900 mb-2">No results found</h3>
                   <p className="text-sm text-gray-500 font-medium">Try adjusting your filters or search term to find a faculty member.</p>
                </div>
              )}
            </div>
          </>
        )}

        {viewMode === "profile" && selectedTeacher && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Profile card */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-sm">
                    <div className="relative mx-auto w-32 h-32 mb-6">
                      <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-16 w-16 text-blue-600" />
                      </div>
                      <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-white ${
                        selectedTeacher.status === "Active" ? "bg-green-500" : "bg-red-500"
                      }`} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedTeacher.name}</h2>
                    <p className="text-gray-500 font-medium mb-4">{selectedTeacher.id}</p>
                    <div className="flex justify-center gap-2 mb-6">
                       <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase">{selectedTeacher.status}</span>
                       <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-bold uppercase">{selectedTeacher.department}</span>
                    </div>
                    <div className="flex flex-col gap-3 text-left border-t border-gray-100 pt-6">
                        <div className="flex items-center gap-3 text-sm">
                           <Mail className="h-4 w-4 text-gray-400" />
                           <span className="text-gray-600">{selectedTeacher.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                           <Phone className="h-4 w-4 text-gray-400" />
                           <span className="text-gray-600">{selectedTeacher.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                           <MapPin className="h-4 w-4 text-gray-400" />
                           <span className="text-gray-600">{selectedTeacher.address}</span>
                        </div>
                    </div>
                  </div>

                  {/* Quick Control Center */}
                  <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl">
                     <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-400" />
                        Staff Controls
                     </h3>
                     <div className="space-y-3">
                        <button 
                          onClick={() => setViewMode("resetPassword")}
                          className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-3 px-4 transition-colors"
                        >
                           <Key className="h-4 w-4 text-amber-400" />
                           <span className="text-sm font-medium">Reset Password</span>
                        </button>
                        <button 
                           onClick={() => {
                              const blocked = toggleUserBlock(selectedTeacher.name);
                              alert(`${selectedTeacher.name} has been ${blocked ? "blocked from" : "unblocked for"} system access.`);
                           }}
                           className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-3 px-4 transition-colors"
                        >
                           {loadSettings().blockedUsers.includes(selectedTeacher.name) ? (
                              <><Unlock className="h-4 w-4 text-green-400" /> <span className="text-sm font-medium">Reactivate Access</span></>
                           ) : (
                              <><Ban className="h-4 w-4 text-red-400" /> <span className="text-sm font-medium">Suspend Account</span></>
                           )}
                        </button>
                        <button 
                          onClick={() => setViewMode("assign")}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center gap-3 px-4 transition-all hover:scale-105"
                        >
                           <FileText className="h-4 w-4 text-white" />
                           <span className="text-sm font-medium">Assign To Classes</span>
                        </button>
                     </div>
                  </div>
                </div>

                {/* Main Details Area */}
                <div className="lg:col-span-2 space-y-6">
                   <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">Professional Profile</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                           { label: "Experience", value: selectedTeacher.experience },
                           { label: "Degree", value: selectedTeacher.qualification },
                           { label: "Enrolled", value: selectedTeacher.joinDate },
                           { label: "Dept.", value: selectedTeacher.department },
                        ].map(stat => (
                           <div key={stat.label} className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-center">
                              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{stat.label}</p>
                              <p className="text-sm font-bold text-blue-700">{stat.value}</p>
                           </div>
                        ))}
                      </div>
                   </div>

                   <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                         Assigned Subjects
                         <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{selectedTeacher.subjects.length} Total</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {selectedTeacher.subjects.map(subject => (
                            <div key={subject} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                               <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center border border-gray-200 shadow-sm">
                                  <BookOpen className="h-5 w-5 text-blue-500" />
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-gray-900">{subject}</p>
                                  <p className="text-xs text-gray-500">Core Subject</p>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                         Assigned Classes & Timetable
                         <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">{selectedTeacher.classes.length} Classes</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         {selectedTeacher.classes.map(cls => (
                            <div key={cls} className="flex items-center justify-between p-4 bg-blue-50/30 rounded-2xl border border-blue-100 group hover:border-blue-300 transition-all">
                               <div className="flex items-center gap-4">
                                  <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md">
                                     {cls.split(" ")[1]}
                                  </div>
                                  <span className="text-sm font-bold text-gray-900">{cls}</span>
                               </div>
                               <button 
                                 onClick={() => setViewMode("schedule")}
                                 className="text-[10px] font-black uppercase text-blue-600 hover:tracking-widest transition-all"
                               >
                                 Timetable →
                               </button>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>
           </div>
        )}

        {viewMode === "assign" && selectedTeacher && (
           <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-md animate-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Manage Class Assignments</h2>
              <p className="text-gray-500 font-medium mb-8">Assigning sections to {selectedTeacher.name}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 {["Form 1A", "Form 2B", "Form 3C", "Form 4A", "Form 5B", "Form 6C"].map(cls => {
                    const isActive = selectedTeacher.classes.includes(cls);
                    return (
                       <div key={cls} className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${isActive ? "border-blue-600 bg-blue-50" : "border-gray-100 hover:border-blue-200"}`}>
                          <div className="flex items-center justify-between mb-4">
                             <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-gray-100 text-gray-400"}`}>
                                <Briefcase className="w-5 h-5" />
                             </div>
                             <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isActive ? "border-blue-600 bg-blue-600" : "border-gray-200"}`}>
                                {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                             </div>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">{cls}</h3>
                          <p className="text-xs text-gray-500 font-semibold">{isActive ? "Current Assignment" : "Available to Assign"}</p>
                       </div>
                    );
                 })}
              </div>

              <div className="flex justify-end gap-4 border-t pt-8">
                 <button onClick={() => setViewMode("profile")} className="px-6 py-2.5 border border-gray-300 rounded-xl font-bold hover:bg-gray-50 text-sm transition-colors uppercase tracking-widest text-gray-400">Cancel</button>
                 <button onClick={() => { alert("Assignments updated"); setViewMode("profile"); }} className="px-10 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all hover:scale-105 text-sm uppercase tracking-widest">Confirm Updates</button>
              </div>
           </div>
        )}

        {viewMode === "schedule" && selectedTeacher && (
           <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-md animate-in slide-in-from-bottom-4 duration-500 overflow-hidden">
              <h2 className="text-2xl font-black text-gray-900 mb-8 pb-6 border-b">{selectedTeacher.name}'s Weekly Load</h2>
              
              <div className="overflow-x-auto">
                 <table className="w-full min-w-[800px]">
                    <thead>
                       <tr className="bg-gray-900">
                          <th className="p-4 text-left text-[10px] font-black uppercase text-gray-400 rounded-l-2xl">Time Period</th>
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => (
                             <th key={day} className="p-4 text-left text-[10px] font-black uppercase text-gray-400">{day}</th>
                          ))}
                          <th className="rounded-r-2xl" />
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {["08:00 AM", "10:00 AM", "01:00 PM", "03:00 PM"].map((time, idx) => (
                          <tr key={time} className="hover:bg-blue-50/10 transition-colors">
                             <td className="p-6 text-xs font-black text-gray-400 whitespace-nowrap">{time}</td>
                             {[0, 1, 2, 3, 4].map(dayIdx => (
                                <td key={dayIdx} className="p-2">
                                   {(idx + dayIdx) % 3 === 0 ? (
                                      <div className="bg-white border border-blue-50 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-default border-l-4 border-l-blue-600">
                                         <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Mathematics</p>
                                         <p className="text-sm font-black text-gray-900">Form 4A</p>
                                         <div className="mt-2 text-[9px] font-bold text-gray-400 flex items-center gap-1 uppercase">
                                            <MapPin className="w-2.5 h-2.5 text-gray-300" /> Room B-201
                                         </div>
                                      </div>
                                   ) : (
                                      <div className="h-16 flex items-center justify-center">
                                         <div className="w-1 h-1 bg-gray-100 rounded-full" />
                                      </div>
                                   )}
                                </td>
                             ))}
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {viewMode === "resetPassword" && selectedTeacher && (
           <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-md animate-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                 <div className="h-12 w-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                    <Lock className="h-6 w-6" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Security Override</h2>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-0.5">Password Modification for {selectedTeacher.name}</p>
                 </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-8 flex items-start gap-4">
                 <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                 <div>
                    <p className="text-sm font-bold text-blue-900">Administrative Precaution</p>
                    <p className="text-xs text-blue-700 font-medium">Changing a user's password will immediately invalidate their current session. The teacher will be forced to log in with the new credentials.</p>
                 </div>
              </div>

              <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">New Secure Password</label>
                    <div className="relative">
                       <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                       <input 
                        type="password" 
                        placeholder="••••••••••••" 
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none font-mono"
                       />
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Confirm New Password</label>
                    <div className="relative">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                       <input 
                        type="password" 
                        placeholder="••••••••••••" 
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none font-mono"
                       />
                    </div>
                 </div>

                 <div className="pt-6 flex gap-4">
                    <button onClick={() => setViewMode("profile")} className="flex-1 py-4 border border-gray-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all">Cancel Request</button>
                    <button onClick={() => { alert("Password updated successfully"); setViewMode("profile"); }} className="flex-[2] py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-100">Update Credentials</button>
                 </div>
              </div>
           </div>
        )}

        {viewMode === "add" && (
           <div className="bg-white border border-gray-200 rounded-[2.5rem] p-12 shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -ml-32 -mb-32 opacity-60" />
              
              <div className="relative">
                <div className="flex items-center gap-6 mb-12">
                   <div className="h-16 w-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-200 rotate-3 hover:rotate-0 transition-transform">
                      <Plus className="h-8 w-8" />
                   </div>
                   <div>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight">Register New Faculty</h2>
                      <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Personnel Information Management System</p>
                   </div>
                </div>

                <form className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   {/* Personal Info */}
                   <div className="space-y-8">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest">Personal Identification</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Full Legal Name *</label>
                          <input type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all font-bold placeholder:text-gray-300" placeholder="e.g. Dr. Robert Stevenson" />
                        </div>
                        
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Gender Perspective</label>
                          <div className="flex gap-3">
                             {["Male", "Female"].map(g => (
                                <label key={g} className="flex-1 flex items-center justify-center gap-2 p-4 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all font-bold group">
                                   <input type="radio" name="gender" className="accent-blue-600 w-4 h-4" />
                                   <span className="text-xs group-hover:text-blue-600 transition-colors">{g}</span>
                                </label>
                             ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">National ID / Passport</label>
                          <input type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold" placeholder="ID-0000-XX" />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Permanent Residence</label>
                          <textarea rows={3} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold resize-none" placeholder="Enter physical address..." />
                        </div>
                      </div>
                   </div>

                   {/* Professional Info */}
                   <div className="space-y-8">
                      <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="w-5 h-5 text-amber-600" />
                        <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest">Professional Credentials</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Highest Qualification</label>
                          <select className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-bold appearance-none">
                             <option>Bachelors Degree</option>
                             <option>Masters Degree</option>
                             <option>PhD / Doctorate</option>
                             <option>Diploma / Specialization</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Primary Department</label>
                          <select className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-bold appearance-none">
                             <option>Mathematics</option>
                             <option>Science & Tech</option>
                             <option>Languages & Lit</option>
                             <option>Social Sciences</option>
                             <option>Arts & Sports</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Years of Tenure</label>
                          <input type="number" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-bold" placeholder="0" />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Hire Date</label>
                          <input type="date" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-bold" />
                        </div>

                        <div className="md:col-span-2 pt-12">
                          <button type="button" className="w-full py-5 bg-gray-900 text-white font-black rounded-3xl hover:bg-black transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-blue-900/20 uppercase tracking-widest text-xs">
                             Authorize Registration & Deploy
                          </button>
                          <p className="text-[9px] text-gray-400 text-center mt-4 font-bold uppercase tracking-tight italic">Warning: This action will generate unique system credentials for the member.</p>
                        </div>
                      </div>
                   </div>
                </form>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
