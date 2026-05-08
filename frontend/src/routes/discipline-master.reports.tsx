import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { usePermissionStore } from "@/lib/permissionStore";
import { useAttendanceStore } from "@/lib/attendanceStore";
import { studentsData } from "@/lib/mockDatabase";
import { 
  BarChart, 
  Bar, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { 
  Users, 
  FileText, 
  AlertCircle, 
  TrendingUp,
  Download,
  Shield,
  ChevronRight,
  Calendar
} from "lucide-react";

export const Route = createFileRoute('/discipline-master/reports')({
  component: ReportsPage,
});

function ReportsPage() {
  const [view, setView] = useState<'general' | 'discipline' | 'permission' | 'attendance'>('general');
  const [selectedTerm, setSelectedTerm] = useState('Term 1 2024');
  const [selectedClass, setSelectedClass] = useState('Form 1');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { permissions } = usePermissionStore();
  const { sessions } = useAttendanceStore();

  const terms = ["Term 1 2024", "Term 2 2024", "Term 3 2024", "Term 1 2025"];
  const classes = ["Form 1", "Form 2", "Form 3", "Form 4", "Form 5", "Form 6"];

  const filteredPermissions = permissions.filter(p => !p.term || p.term === selectedTerm);
  const filteredSessions = sessions.filter(s => !s.term || s.term === selectedTerm);

  const targetSession = filteredSessions.find(s => s.classLevel === selectedClass && s.date === selectedDate);
  const totalPresent = targetSession?.records.filter(r => r.status === 'present').length || 0;
  const totalAbsent = targetSession?.records.filter(r => r.status === 'absent').length || 0;
  const totalLate = targetSession?.records.filter(r => r.status === 'late').length || 0;

  const totalPermissions = filteredPermissions.length;
  const overdueCount = filteredPermissions.filter(p => p.status === 'active' && new Date(p.dateIn) < new Date()).length;
  const returnedCount = filteredPermissions.filter(p => p.status === 'returned').length;
  
  const totalAttendances = filteredSessions.length;
  const lastSession = filteredSessions[filteredSessions.length - 1];
  const todayPresent = lastSession?.records.filter(r => r.status === 'present').length || 0;
  const todayAbsent = lastSession?.records.filter(r => r.status === 'absent').length || 0;

  const attendanceData = filteredSessions.slice(-7).map((s) => ({
    name: s.date,
    present: s.records.filter(r => r.status === 'present').length,
    absent: s.records.filter(r => r.status === 'absent').length,
  }));

  const permissionData = [
    { name: 'Active', value: filteredPermissions.filter(p => p.status === 'active').length },
    { name: 'Returned', value: returnedCount },
    { name: 'Overdue', value: overdueCount },
  ];

  const disciplineData = [
    { name: 'Honors', count: studentsData.filter(s => s.disciplineMarks >= 36).length },
    { name: 'Good', count: studentsData.filter(s => s.disciplineMarks >= 28 && s.disciplineMarks < 36).length },
    { name: 'Warning', count: studentsData.filter(s => s.disciplineMarks < 28).length },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#ef4444'];

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 px-2">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
             <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                System <span className="text-gradient">Reports</span>
             </h1>
             <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">{selectedTerm}</span>
          </div>
          <p className="text-muted-foreground text-sm">
            {view === 'general' ? 'Holistic view of attendance and student leave analytics.' : `Detailed ${view.charAt(0).toUpperCase() + view.slice(1)} Analytics Report.`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none">
            <select 
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full appearance-none bg-white border border-border px-10 py-3 rounded-2xl text-xs font-black focus:ring-4 focus:ring-primary/10 outline-none transition-all cursor-pointer shadow-sm"
            >
              {terms.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary h-4 w-4" />
          </div>

          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-hero-gradient text-white px-6 py-3 rounded-2xl text-xs font-black shadow-xl hover:glow-primary transition-all">
            <Download className="h-4 w-4" /> EXPORT
          </button>
        </div>
      </div>

      {view === 'general' ? (
        <div className="space-y-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <button onClick={() => setView('discipline')} className="glass-card group rounded-[32px] p-6 border-glow flex items-center justify-between hover:bg-white transition-all shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-2xl text-primary"><Shield className="h-6 w-6" /></div>
                <div className="text-left"><p className="font-black text-sm text-foreground uppercase tracking-wider">Discipline</p><p className="text-[10px] text-muted-foreground font-bold">Conduct Trends</p></div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => setView('permission')} className="glass-card group rounded-[32px] p-6 border-glow flex items-center justify-between hover:bg-white transition-all shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-green-500/10 p-3 rounded-2xl text-green-600"><FileText className="h-6 w-6" /></div>
                <div className="text-left"><p className="font-black text-sm text-foreground uppercase tracking-wider">Permissions</p><p className="text-[10px] text-muted-foreground font-bold">Leave Records</p></div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => setView('attendance')} className="glass-card group rounded-[32px] p-6 border-glow flex items-center justify-between hover:bg-white transition-all shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-600"><Users className="h-6 w-6" /></div>
                <div className="text-left"><p className="font-black text-sm text-foreground uppercase tracking-wider">Attendance</p><p className="text-[10px] text-muted-foreground font-bold">Daily Presence</p></div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card rounded-3xl p-5 border-glow shadow-sm"><h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Sessions</h3><p className="text-2xl font-black">{totalAttendances}</p></div>
            <div className="glass-card rounded-3xl p-5 border-glow shadow-sm"><h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Leaves</h3><p className="text-2xl font-black">{totalPermissions}</p></div>
            <div className="glass-card rounded-3xl p-5 border-glow shadow-sm"><h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Overdue</h3><p className="text-2xl font-black text-red-600">{overdueCount}</p></div>
            <div className="glass-card rounded-3xl p-5 border-glow shadow-sm"><h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Sync Rate</h3><p className="text-2xl font-black text-primary">{totalAttendances > 0 ? Math.round((todayPresent / (todayPresent + todayAbsent || 1)) * 100) : 0}%</p></div>
          </div>
        </div>
      ) : view === 'permission' ? (
        <div className="space-y-6">
           <button onClick={() => setView('general')} className="text-[10px] font-black uppercase text-primary flex items-center gap-2 hover:underline"><ChevronRight className="h-3 w-3 rotate-180" /> Back to Dashboard</button>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card rounded-2xl p-4 border-glow text-center group"><p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Total</p><p className="text-xl font-black">{totalPermissions}</p></div>
              <div className="glass-card rounded-2xl p-4 border-glow text-center"><p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Success</p><p className="text-xl font-black text-green-600">{returnedCount}</p></div>
              <div className="glass-card rounded-2xl p-4 border-glow text-center"><p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Critical</p><p className="text-xl font-black text-red-600">{overdueCount}</p></div>
              <div className="glass-card rounded-2xl p-4 border-glow text-center"><p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Current</p><p className="text-xl font-black text-blue-600">{filteredPermissions.filter(p => p.status === 'active').length}</p></div>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="glass-card rounded-[32px] p-6 border-glow shadow-sm flex flex-col items-center">
                 <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground mb-6">Leave Dynamics</h3>
                 <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie data={permissionData} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8}>
                             {permissionData.map((e, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                          </Pie>
                          <Tooltip /><Legend verticalAlign="bottom" height={36}/>
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
              </div>
              <div className="lg:col-span-2 glass-card rounded-[32px] overflow-hidden border-glow shadow-sm border border-border/50">
                 <div className="p-5 border-b border-border/50 bg-surface/30 px-8 flex justify-between items-center"><h3 className="font-black text-xs uppercase tracking-[0.2em] text-muted-foreground">Detailed Logs</h3><span className="text-[10px] font-bold text-primary">TERM VIEW</span></div>
                 <div className="max-h-[350px] overflow-y-auto overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[600px]">
                       <thead className="text-[10px] font-black text-muted-foreground border-b border-border uppercase tracking-widest bg-surface/10">
                          <tr><th className="px-8 py-5">Student</th><th className="px-8 py-5">Context</th><th className="px-8 py-5">Timeline</th><th className="px-8 py-5 text-right">Status</th></tr>
                       </thead>
                       <tbody className="divide-y divide-border/20">
                          {filteredPermissions.map(p => (
                             <tr key={p.id} className="hover:bg-surface/30 transition-colors">
                                <td className="px-8 py-5"><p className="font-black text-foreground">{p.studentName}</p><p className="text-[10px] text-muted-foreground font-bold">{p.classLevel}</p></td>
                                <td className="px-8 py-5 text-xs truncate max-w-[150px] font-medium text-muted-foreground">{p.reason}</td>
                                <td className="px-8 py-5 text-[10px] font-bold text-muted-foreground">{p.dateOut} <ArrowRight className="inline h-2 w-2 mx-1" /> {p.dateIn}</td>
                                <td className="px-8 py-5 text-right"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${p.status === 'returned' ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'}`}>{p.status}</span></td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        </div>
      ) : view === 'attendance' ? (
        <div className="space-y-6">
           <button onClick={() => setView('general')} className="text-[10px] font-black uppercase text-primary flex items-center gap-2 hover:underline"><ChevronRight className="h-3 w-3 rotate-180" /> Back to Dashboard</button>
           <div className="glass-card rounded-[32px] p-6 border-glow flex flex-col md:flex-row gap-4 items-end shadow-sm">
              <div className="space-y-2 flex-1 w-full"><label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Class</label><select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full bg-white border border-border p-3.5 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-primary/10 transition-all">{classes.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div className="space-y-2 flex-1 w-full"><label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Date</label><input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full bg-white border border-border p-3.5 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-primary/10 transition-all" /></div>
           </div>

           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card rounded-2xl p-5 border-glow text-center"><p className="text-[10px] font-black text-muted-foreground mb-1">PRESENT</p><p className="text-2xl font-black text-green-600">{totalPresent}</p></div>
              <div className="glass-card rounded-2xl p-5 border-glow text-center"><p className="text-[10px] font-black text-muted-foreground mb-1">ABSENT</p><p className="text-2xl font-black text-red-600">{totalAbsent}</p></div>
              <div className="glass-card rounded-2xl p-5 border-glow text-center"><p className="text-[10px] font-black text-muted-foreground mb-1">LATE</p><p className="text-2xl font-black text-orange-600">{totalLate}</p></div>
              <div className="glass-card rounded-2xl p-5 border-glow text-center"><p className="text-[10px] font-black text-muted-foreground mb-1">RATE</p><p className="text-2xl font-black text-primary">{totalPresent + totalAbsent > 0 ? Math.round((totalPresent / (totalPresent + totalAbsent)) * 100) : 0}%</p></div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass-card rounded-[32px] overflow-hidden border-glow shadow-sm">
                 <div className="p-5 border-b border-border/50 bg-surface/30 px-8 flex justify-between items-center"><h3 className="font-black text-xs uppercase tracking-[0.2em] text-red-600 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Action Required</h3></div>
                 <div className="max-h-[350px] overflow-y-auto overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[500px]">
                       <thead className="bg-surface/10 text-[10px] uppercase font-black text-muted-foreground tracking-widest">
                          <tr><th className="px-8 py-4">Student</th><th className="px-8 py-4">Status</th><th className="px-8 py-4 text-right">Channel</th></tr>
                       </thead>
                       <tbody className="divide-y divide-border/20">
                          {targetSession?.records.filter(r => r.status === 'absent').map((r, i) => (
                            <tr key={i} className="hover:bg-red-50/10">
                               <td className="px-8 py-4 font-black text-foreground">{r.studentName}</td>
                               <td className="px-8 py-4"><span className="text-red-600 font-black text-[10px] uppercase bg-red-50 px-2 py-0.5 rounded-full">Missing</span></td>
                               <td className="px-8 py-4 text-right"><button className="text-primary text-[10px] font-black hover:underline uppercase tracking-wider">SMS Parent</button></td>
                            </tr>
                          )) || <tr><td colSpan={3} className="px-8 py-12 text-center text-muted-foreground italic">No absences recorded for this selection.</td></tr>}
                       </tbody>
                    </table>
                 </div>
              </div>
              <div className="glass-card rounded-[32px] p-8 border-glow shadow-sm flex flex-col items-center">
                 <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">Session Trend</h3>
                 <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={attendanceData}>
                          <Bar dataKey="present" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="space-y-6">
           <button onClick={() => setView('general')} className="text-[10px] font-black uppercase text-primary flex items-center gap-2 hover:underline"><ChevronRight className="h-3 w-3 rotate-180" /> Back to Dashboard</button>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="glass-card rounded-2xl p-6 border-glow text-center"><p className="text-[10px] font-black text-muted-foreground uppercase opacity-60 mb-2">Honors</p><p className="text-3xl font-black text-green-600">{disciplineData[0].count}</p></div>
              <div className="glass-card rounded-2xl p-6 border-glow text-center"><p className="text-[10px] font-black text-muted-foreground uppercase opacity-60 mb-2">Standard</p><p className="text-3xl font-black text-blue-600">{disciplineData[1].count}</p></div>
              <div className="glass-card rounded-2xl p-6 border-glow text-center"><p className="text-[10px] font-black text-muted-foreground uppercase opacity-60 mb-2">Review</p><p className="text-3xl font-black text-red-600">{disciplineData[2].count}</p></div>
           </div>
           <div className="glass-card rounded-[32px] overflow-hidden border-glow shadow-sm"><div className="p-5 border-b border-border/50 bg-surface/30 font-black text-xs uppercase tracking-[0.2em] text-muted-foreground px-8">Scoreboard (Term {selectedTerm})</div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm min-w-[500px]">
                    <thead className="bg-surface/10 text-[10px] uppercase font-black text-muted-foreground tracking-widest"><tr><th className="px-8 py-5">Student</th><th className="px-8 py-5 text-right">Conduct Index</th></tr></thead>
                    <tbody className="divide-y divide-border/20">{studentsData.map(s => (<tr key={s.id} className="hover:bg-surface/30 transition-colors"><td className="px-8 py-5 font-black text-foreground">{s.name}</td><td className="px-8 py-5 text-right font-black tabular-nums">{s.disciplineMarks}/40</td></tr>))}</tbody>
                 </table>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  );
}
