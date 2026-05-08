import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { studentsData } from "@/lib/mockDatabase";
import { 
  Shield, 
  Search, 
  ChevronRight, 
  Calendar,
  AlertCircle,
  Trophy,
  History,
  MinusCircle,
  Users
} from "lucide-react";

export const Route = createFileRoute('/discipline-master/discipline')({
  component: DisciplineManagement,
});

function DisciplineManagement() {
  const [selectedTerm, setSelectedTerm] = useState('Term 1 2024');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [searchQuery, setSearchQuery] = useState("");
  
  const terms = ["Term 1 2024", "Term 2 2024", "Term 3 2024", "Term 1 2025"];
  const classes = ["All Classes", "Form 1", "Form 2", "Form 3", "Form 4", "Form 5", "Form 6"];

  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.indexNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === "All Classes" || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Term Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/10 p-2.5 rounded-2xl text-primary">
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Discipline <span className="text-gradient">Management</span>
            </h1>
          </div>
          <p className="text-muted-foreground ml-1">Track and manage student conduct marks per academic term.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Term Selector */}
          <div className="relative group flex-1 md:flex-none">
            <select 
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="appearance-none bg-surface border border-border px-11 py-3 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer w-full md:min-w-[160px]"
            >
              {terms.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 rotate-90 text-muted-foreground pointer-events-none" />
          </div>

          {/* Class Selector */}
          <div className="relative group flex-1 md:flex-none">
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="appearance-none bg-surface border border-border px-11 py-3 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer w-full md:min-w-[160px]"
            >
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 rotate-90 text-muted-foreground pointer-events-none" />
          </div>
          
          <a 
            href="/discipline-master/deduct-marks"
            className="group flex items-center gap-2 bg-red-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/20 transition-all active:scale-95 whitespace-nowrap"
          >
            <MinusCircle className="h-5 w-5" />
            Deduct Marks
          </a>
        </div>
      </div>

      {/* Stats Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="glass-card rounded-[32px] p-5 md:p-6 border-glow flex items-center gap-5 shadow-sm">
           <div className="bg-green-500/10 p-4 rounded-2xl text-green-600 shadow-inner"><Trophy className="h-6 md:h-7 w-6 md:w-7" /></div>
           <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Honors</p>
              <p className="text-xl md:text-2xl font-black tabular-nums">{studentsData.filter(s => s.disciplineMarks >= 36).length}</p>
           </div>
        </div>
        <div className="glass-card rounded-[32px] p-5 md:p-6 border-glow flex items-center gap-5 shadow-sm">
           <div className="bg-orange-500/10 p-4 rounded-2xl text-orange-600 shadow-inner"><History className="h-6 md:h-7 w-6 md:w-7" /></div>
           <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Avg Score</p>
              <p className="text-xl md:text-2xl font-black tabular-nums">36.5</p>
           </div>
        </div>
        <div className="glass-card rounded-[32px] p-5 md:p-6 border-glow flex items-center gap-5 shadow-sm col-span-1 sm:col-span-2 lg:col-span-1">
           <div className="bg-red-500/10 p-4 rounded-2xl text-red-600 shadow-inner"><AlertCircle className="h-6 md:h-7 w-6 md:w-7" /></div>
           <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Critical Cases</p>
              <p className="text-xl md:text-2xl font-black text-red-600 tabular-nums">{studentsData.filter(s => s.disciplineMarks <= 20).length}</p>
           </div>
        </div>
      </div>

      {/* Main Scoreboard Section */}
      <div className="glass-card rounded-3xl overflow-hidden border-glow shadow-sm bg-white/50 backdrop-blur-sm">
        <div className="p-8 border-b border-border/50 bg-surface/30 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <h2 className="text-xl font-bold">Conduct Scoreboard</h2>
             <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">{selectedTerm}</span>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by name or index number..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/80 border border-border px-11 py-3 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface/20 text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              <tr>
                <th className="px-8 py-5">Index #</th>
                <th className="px-8 py-5">Student Name</th>
                <th className="px-8 py-5">Class Level</th>
                <th className="px-8 py-5 text-right font-black">Current Marks</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredStudents.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-8 py-20 text-center text-muted-foreground italic">No students found matching your search.</td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-surface/40 transition-colors group">
                    <td className="px-8 py-5 text-sm font-mono text-muted-foreground">{student.indexNumber}</td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors">{student.name}</p>
                      <p className="text-[10px] text-muted-foreground">ID: {student.nationalId.slice(0, 4)}...</p>
                    </td>
                    <td className="px-8 py-5 font-semibold text-sm text-muted-foreground">{student.class}</td>
                    <td className="px-8 py-5 text-right">
                       <span className="text-lg font-black text-foreground">{student.disciplineMarks}</span>
                       <span className="text-xs text-muted-foreground font-bold"> / 40</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm ${
                         student.disciplineMarks >= 36 ? "bg-green-50 text-green-700 border border-green-100" :
                         student.disciplineMarks >= 28 ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-red-50 text-red-700 border border-red-100"
                       }`}>
                         {student.disciplineMarks >= 36 ? "Honors" : student.disciplineMarks >= 28 ? "Good" : "Warning"}
                       </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

