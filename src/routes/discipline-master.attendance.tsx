import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { studentsData } from "@/lib/mockDatabase";
import { useAttendanceStore } from "@/lib/attendanceStore";
import { 
  Users, 
  History, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar,
  Save,
  Filter,
  ChevronRight
} from "lucide-react";

export const Route = createFileRoute('/discipline-master/attendance')({
  component: AttendanceManagement,
});

function AttendanceManagement() {
  const [activeTab, setActiveTab] = useState<'take' | 'recorded'>('take');
  const [selectedClass, setSelectedClass] = useState('Form 1');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<Record<number, 'present' | 'absent' | 'late'>>({});
  const { sessions, saveSession } = useAttendanceStore();

  const classes = ["Form 1", "Form 2", "Form 3", "Form 4", "Form 5", "Form 6"];

  const filteredStudents = studentsData.filter(s => s.class === selectedClass);

  const handleStatusChange = (studentId: number, status: 'present' | 'absent' | 'late') => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = () => {
    const currentTerm = "Term 1 2024"; // Consistent with other reports
    const records = filteredStudents.map(s => ({
      studentId: s.id,
      studentName: s.name,
      status: attendanceData[s.id] || 'present' // default to present
    }));

    saveSession({
      date: attendanceDate,
      classLevel: selectedClass,
      term: currentTerm,
      records,
      recordedBy: "DOD Officer"
    });

    alert(`Attendance for ${selectedClass} on ${attendanceDate} saved successfully!`);
    setActiveTab('recorded');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Attendance <span className="text-gradient">Management</span>
          </h1>
          <p className="text-muted-foreground mt-1">Record and track daily student presence.</p>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex bg-surface p-1.5 rounded-2xl border border-border/50 shadow-sm">
          <button 
            onClick={() => setActiveTab('take')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'take' ? 'bg-white shadow-md text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Users className="h-4 w-4" />
            Take Attendance
          </button>
          <button 
            onClick={() => setActiveTab('recorded')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'recorded' ? 'bg-white shadow-md text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <History className="h-4 w-4" />
            Recorded Attendance
          </button>
        </div>
      </div>

      {activeTab === 'take' ? (
        <div className="space-y-6">
          {/* Controls */}
          <div className="glass-card rounded-3xl p-6 border-glow flex flex-col md:flex-row gap-6 items-end">
            <div className="space-y-2 flex-1 w-full text-left">
              <label className="text-sm font-semibold text-muted-foreground ml-1">Step 1: Choose Class</label>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select 
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-surface/50 border border-input rounded-2xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                >
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2 flex-1 w-full text-left">
              <label className="text-sm font-semibold text-muted-foreground ml-1">Step 2: Selection Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full bg-surface/50 border border-input rounded-2xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Student List */}
          <div className="glass-card rounded-3xl overflow-hidden border-glow">
            <div className="p-6 border-b border-border/50 bg-surface/30 flex justify-between items-center">
              <h2 className="font-bold text-lg">Marking Attendance for {selectedClass}</h2>
              <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                {filteredStudents.length} Students Found
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-surface/20">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Student Name</th>
                    <th className="px-6 py-4 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-6 py-12 text-center text-muted-foreground">
                        No students found in {selectedClass}.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-surface/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {s.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-foreground">{s.name}</div>
                              <div className="text-xs text-muted-foreground">{s.indexNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2">
                             <button 
                               onClick={() => handleStatusChange(s.id, 'present')}
                               className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black border transition-all ${
                                 (attendanceData[s.id] === 'present' || !attendanceData[s.id]) 
                                   ? 'bg-green-50 text-green-700 border-green-200 shadow-sm' 
                                   : 'bg-surface text-muted-foreground border-border'
                               }`}
                             >
                               <CheckCircle2 className="h-3 w-3" /> PRESENT
                             </button>
                             <button 
                               onClick={() => handleStatusChange(s.id, 'absent')}
                               className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black border transition-all ${
                                 attendanceData[s.id] === 'absent' 
                                   ? 'bg-red-50 text-red-700 border-red-200 shadow-sm' 
                                   : 'bg-surface text-muted-foreground border-border'
                               }`}
                             >
                               <XCircle className="h-3 w-3" /> ABSENT
                             </button>
                             <button 
                               onClick={() => handleStatusChange(s.id, 'late')}
                               className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black border transition-all ${
                                 attendanceData[s.id] === 'late' 
                                   ? 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm' 
                                   : 'bg-surface text-muted-foreground border-border'
                               }`}
                             >
                               <Clock className="h-3 w-3" /> LATE
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Save Button at the Bottom */}
            {filteredStudents.length > 0 && (
              <div className="p-6 bg-surface/30 border-t border-border/50 flex justify-end">
                <button 
                  onClick={handleSaveAttendance}
                  className="w-full md:w-auto bg-hero-gradient text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:glow-primary transition-all active:scale-95 shadow-xl"
                >
                  <Save className="h-5 w-5" />
                  Save Attendance
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Recorded Attendance History */
        <div className="space-y-6">
          {/* Lookup Controls */}
          <div className="glass-card rounded-3xl p-6 border-glow flex flex-col md:flex-row gap-6 items-end">
            <div className="space-y-2 flex-1 w-full text-left">
              <label className="text-sm font-semibold text-muted-foreground ml-1">Select Class</label>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select 
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-surface/50 border border-input rounded-2xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                >
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2 flex-1 w-full text-left">
              <label className="text-sm font-semibold text-muted-foreground ml-1">Select Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full bg-surface/50 border border-input rounded-2xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                />
              </div>
            </div>
            
            <div className="flex-none pb-1">
              <div className="bg-primary/5 px-4 py-3 rounded-2xl border border-primary/10 flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-primary">Viewing Records</span>
              </div>
            </div>
          </div>

          {/* Results Area */}
          {(() => {
            const matchedSession = sessions.find(s => s.classLevel === selectedClass && s.date === attendanceDate);
            
            if (!matchedSession) {
              return (
                <div className="py-20 text-center glass-card rounded-3xl border-glow">
                  <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground font-medium">No attendance recorded for {selectedClass} on {attendanceDate}.</p>
                </div>
              );
            }

            return (
              <div className="glass-card rounded-3xl overflow-hidden border-glow">
                <div className="p-6 border-b border-border/50 bg-green-50/30 flex justify-between items-center">
                  <div>
                    <h2 className="font-bold text-lg text-foreground">Attendance Records Found</h2>
                    <div className="flex items-center gap-2 mt-1">
                       <p className="text-xs text-muted-foreground">Recorded by {matchedSession.recordedBy}</p>
                       <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase">{matchedSession.term}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-center bg-white px-4 py-2 rounded-xl shadow-sm border border-border">
                      <div className="text-xs font-bold text-green-600">PRESENT</div>
                      <div className="text-lg font-black">{matchedSession.records.filter(r => r.status === 'present').length}</div>
                    </div>
                    <div className="text-center bg-white px-4 py-2 rounded-xl shadow-sm border border-border">
                      <div className="text-xs font-bold text-red-600">ABSENT</div>
                      <div className="text-lg font-black">{matchedSession.records.filter(r => r.status === 'absent').length}</div>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-surface/20">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Student Name</th>
                        <th className="px-6 py-4 font-semibold text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {matchedSession.records.map((r) => (
                        <tr key={r.studentId} className="hover:bg-surface/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-foreground">{r.studentName}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border ${
                                r.status === 'present' ? 'bg-green-50 text-green-700 border-green-200' :
                                r.status === 'absent' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }`}>
                                {r.status === 'present' && <CheckCircle2 className="h-3.5 w-3.5" />}
                                {r.status === 'absent' && <XCircle className="h-3.5 w-3.5" />}
                                {r.status === 'late' && <Clock className="h-3.5 w-3.5" />}
                                {r.status.toUpperCase()}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

