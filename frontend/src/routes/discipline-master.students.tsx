import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { studentsData, Student } from "@/lib/mockDatabase";
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Clock,
  ShieldAlert,
  Calendar,
  X,
  User,
  Heart,
  Droplets,
  Building,
  School,
  Contact,
  MoreVertical,
  Eye
} from "lucide-react";

export const Route = createFileRoute('/discipline-master/students')({
  component: StudentDirectory,
});

function StudentDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [selectedTerm, setSelectedTerm] = useState("Term 1 2024");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const classes = ["All Classes", "Form 1", "Form 2", "Form 3", "Form 4", "Form 5", "Form 6"];
  const years = ["2023-2024", "2024-2025", "2025-2026"];
  const terms = ["Term 1 2024", "Term 2 2024", "Term 3 2024", "Term 1 2025"];

  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.indexNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === "All Classes" || student.class === selectedClass;
    const matchesYear = student.academicYear === selectedYear;
    return matchesSearch && matchesClass && matchesYear;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Student <span className="text-gradient">Registry</span>
          </h1>
          <p className="text-muted-foreground mt-1">Manage and view detailed student profiles and conduct history.</p>
        </div>
        
        <div className="flex bg-surface p-1.5 rounded-2xl border border-border/50 shadow-sm">
           <div className="flex items-center gap-2 px-6 py-2.5 bg-white rounded-xl shadow-md text-primary text-sm font-bold">
              <Users className="h-4 w-4" />
              {filteredStudents.length} Students Listed
           </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card rounded-3xl p-6 border-glow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-surface/50 border border-border px-11 py-3.5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer appearance-none"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
           </div>
           <div className="relative group">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <select 
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full bg-surface/50 border border-border px-11 py-3.5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer appearance-none"
              >
                {terms.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
           </div>
           <div className="relative group">
              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-surface/50 border border-border px-11 py-3.5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer appearance-none"
              >
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
           </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search students..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface/50 border border-border px-12 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Student List (Table) */}
      <div className="glass-card rounded-[32px] overflow-hidden border-glow shadow-sm bg-white/50 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface/30 text-[10px] uppercase font-black text-muted-foreground tracking-widest border-b border-border/50">
              <tr>
                <th className="px-8 py-6">Student Details</th>
                <th className="px-8 py-6">Academic Class</th>
                <th className="px-8 py-6">Gender</th>
                <th className="px-8 py-6 text-right">Conduct Marks</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredStudents.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-8 py-24 text-center text-muted-foreground italic">
                      <div className="flex flex-col items-center gap-3">
                         <div className="bg-surface p-4 rounded-full"><Search className="h-8 w-8 opacity-20" /></div>
                         <p>No students found for {selectedClass} in {selectedTerm}.</p>
                      </div>
                   </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    onClick={() => setSelectedStudent(student)}
                    className="group hover:bg-surface/50 transition-all cursor-pointer border-transparent"
                  >
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-hero-gradient flex items-center justify-center text-white text-xs font-black shadow-lg group-hover:scale-110 transition-transform">
                             {student.name.charAt(0)}
                          </div>
                          <div>
                             <p className="font-bold text-foreground text-sm leading-tight">{student.name}</p>
                             <p className="text-[10px] font-bold text-muted-foreground uppercase">{student.indexNumber}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-2">
                          <GraduationCap className="h-3.5 w-3.5 text-primary" />
                          <span className="text-sm font-semibold">{student.class}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${student.gender === 'Female' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-600'}`}>
                          {student.gender}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <span className={`font-black text-sm ${student.disciplineMarks < 28 ? 'text-red-600' : 'text-green-600'}`}>
                             {student.disciplineMarks}/40
                          </span>
                          <ShieldAlert className={`h-3.5 w-3.5 ${student.disciplineMarks < 28 ? 'text-red-600 animate-pulse' : 'text-green-600'}`} />
                       </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button className="p-2 hover:bg-white rounded-xl transition-all text-primary opacity-0 group-hover:opacity-100 flex items-center gap-2 ml-auto">
                          <span className="text-[10px] font-bold">View Profile</span>
                          <Eye className="h-4 w-4" />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Detail Modal (Enhanced from previous) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setSelectedStudent(null)} />
           <div className="relative w-full max-w-4xl max-h-[90vh] bg-surface rounded-[40px] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
              <div className="p-8 pb-4 flex justify-between items-start">
                 <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-3xl bg-hero-gradient flex items-center justify-center text-white text-3xl font-black shadow-2xl">
                       {selectedStudent.name.charAt(0)}
                    </div>
                    <div>
                       <h2 className="text-3xl font-black text-foreground">{selectedStudent.name}</h2>
                       <div className="flex items-center gap-3 mt-2">
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">{selectedStudent.indexNumber}</span>
                          <span className="px-3 py-1 rounded-full bg-surface border border-border text-xs font-bold text-muted-foreground">{selectedStudent.class} • {selectedStudent.combination}</span>
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-surface-hover rounded-2xl transition-colors"><X className="h-6 w-6" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-10 custom-scrollbar">
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <div className="glass-card p-5 rounded-3xl space-y-3 shadow-sm">
                       <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest"><User className="h-4 w-4" /> Personal</div>
                       <div className="space-y-2">
                          <p className="text-xs">Gender: <span className="font-bold">{selectedStudent.gender}</span></p>
                          <p className="text-xs">Birth Date: <span className="font-bold">{selectedStudent.dob}</span></p>
                          <p className="text-xs">ID: <span className="font-bold underline cursor-pointer">{selectedStudent.nationalId}</span></p>
                       </div>
                    </div>
                    <div className="glass-card p-5 rounded-3xl space-y-3 shadow-sm">
                       <div className="flex items-center gap-2 text-green-600 font-black uppercase text-[10px] tracking-widest"><MapPin className="h-4 w-4" /> Contact</div>
                       <div className="space-y-2">
                          <p className="text-xs truncate">Phone: <span className="font-bold">{selectedStudent.phone}</span></p>
                          <p className="text-xs truncate">Email: <span className="font-bold">{selectedStudent.email}</span></p>
                          <p className="text-xs">City: <span className="font-bold">{selectedStudent.city || "Kigali"}</span></p>
                       </div>
                    </div>
                    <div className="glass-card p-5 rounded-3xl space-y-3 shadow-sm sm:col-span-2 lg:col-span-1">
                       <div className="flex items-center gap-2 text-red-600 font-black uppercase text-[10px] tracking-widest"><Heart className="h-4 w-4" /> Health</div>
                       <div className="space-y-2">
                          <p className="text-xs">Blood Group: <span className="font-bold">{selectedStudent.bloodGroup || "A+"}</span></p>
                          <p className="text-xs">Status: <span className="px-2 py-0.5 rounded bg-green-50 text-green-600 font-black uppercase tracking-tighter shadow-sm">{selectedStudent.status}</span></p>
                          <p className="text-xs">Conduct: <span className="font-black text-primary underline">{selectedStudent.disciplineMarks}/40</span></p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-base md:text-lg font-black flex items-center gap-2 px-2"><Contact className="h-5 w-5 text-primary" /> Family & Guardians</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                       <div className="glass-card p-6 rounded-3xl border-l-[6px] border-blue-500 space-y-4 shadow-sm">
                          <h4 className="font-bold text-sm flex items-center gap-2 text-blue-600 uppercase tracking-widest">Father's Details</h4>
                          <div className="grid grid-cols-2 gap-4">
                             <div><p className="text-[10px] text-muted-foreground uppercase font-black opacity-60">Name</p><p className="text-xs font-bold truncate">{selectedStudent.fatherName || "Unknown"}</p></div>
                             <div><p className="text-[10px] text-muted-foreground uppercase font-black opacity-60">Phone</p><p className="text-xs font-bold truncate">{selectedStudent.fatherPhone || "Unknown"}</p></div>
                             <div className="col-span-2"><p className="text-[10px] text-muted-foreground uppercase font-black opacity-60">Occupation</p><p className="text-xs font-bold truncate">{selectedStudent.fatherOccupation || "Unknown"}</p></div>
                          </div>
                       </div>
                       <div className="glass-card p-6 rounded-3xl border-l-[6px] border-pink-500 space-y-4 shadow-sm">
                          <h4 className="font-bold text-sm flex items-center gap-2 text-pink-600 uppercase tracking-widest">Mother's Details</h4>
                          <div className="grid grid-cols-2 gap-4">
                             <div><p className="text-[10px] text-muted-foreground uppercase font-black opacity-60">Name</p><p className="text-xs font-bold truncate">{selectedStudent.motherName || "Unknown"}</p></div>
                             <div><p className="text-[10px] text-muted-foreground uppercase font-black opacity-60">Phone</p><p className="text-xs font-bold truncate">{selectedStudent.motherPhone || "Unknown"}</p></div>
                             <div className="col-span-2"><p className="text-[10px] text-muted-foreground uppercase font-black opacity-60">Occupation</p><p className="text-xs font-bold truncate">{selectedStudent.motherOccupation || "Unknown"}</p></div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-surface/50 border-t border-border/50 flex justify-end gap-4">
                 <button className="px-6 py-2.5 rounded-2xl border border-border text-sm font-bold hover:bg-surface/80 transition-all">Export PDF</button>
                 <button className="px-8 py-2.5 rounded-2xl bg-hero-gradient text-white text-sm font-bold hover:glow-primary shadow-xl transition-all">Edit Record</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
