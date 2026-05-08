import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Users, BookOpen, ChevronDown, MinusCircle, Calendar, AlertTriangle, FileText, CheckCircle2, X } from "lucide-react";
import { peopleApi, academicApi, disciplineApi } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute('/discipline-master/deduct-marks')({
  component: DeductMarksPage,
});

function DeductMarksPage() {
  const [selectedClass, setSelectedClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showDeductModal, setShowDeductModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [classesList, setClassesList] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for the deduction modal
  const [deductPoints, setDeductPoints] = useState('');
  const [deductReason, setDeductReason] = useState('');
  const [deductCategory, setDeductCategory] = useState('');
  const [deductDate, setDeductDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    academicApi.getClasses().then(res => setClassesList(res.data)).catch(console.error);
    peopleApi.getStudents().then(res => setAllStudents(res.data)).catch(console.error);
  }, []);

  const filteredStudents = allStudents.filter(student => {
    const name = student.full_name || student.name || '';
    const studentId = student.student_id || '';
    const cls = student.class_name || student.class || '';

    const matchesClass = !selectedClass || cls === selectedClass;
    const matchesSearch = !searchTerm ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesClass && matchesSearch;
  });

  const handleFinalize = async () => {
    if (!deductPoints || !deductReason || !deductCategory) {
      toast.error('Please fill in all required fields: Points, Category, and Reason.');
      return;
    }

    setIsSubmitting(true);
    try {
      await disciplineApi.deductMarks({
        student_id: selectedStudent.id,
        points: parseInt(deductPoints),
        reason: deductReason,
        category: deductCategory,
        date: deductDate,
      });

      toast.success(`${deductPoints} marks deducted from ${selectedStudent.full_name || selectedStudent.name}. Parent notified.`);
      setShowDeductModal(false);
      setSelectedStudent(null);
      setDeductPoints('');
      setDeductReason('');
      setDeductCategory('');
    } catch (error) {
      toast.error('Failed to process deduction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
        <div className="flex items-center gap-3">
          <div className="bg-red-500/10 p-3 rounded-2xl text-red-600 shadow-sm"><MinusCircle className="h-6 w-6" /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground">Deduct <span className="text-red-600">Marks</span></h1>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1 opacity-70">Sanction Entry System</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-[32px] p-6 md:p-8 border-glow shadow-sm bg-white/40 backdrop-blur-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Class Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Class Level</label>
            <div className="relative">
              <button
                onClick={() => setShowClassDropdown(!showClassDropdown)}
                className="w-full px-5 py-3.5 bg-white border border-border rounded-2xl flex items-center justify-between hover:bg-surface transition-all shadow-sm focus:ring-4 focus:ring-primary/10"
              >
                <div className="flex items-center gap-2">
                   <BookOpen className="h-4 w-4 text-primary" />
                   <span className={`text-[13px] font-black ${selectedClass ? 'text-foreground' : 'text-muted-foreground'}`}>
                     {selectedClass || 'ALL CLASSES'}
                   </span>
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showClassDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showClassDropdown && (
                <div className="absolute z-20 w-full mt-2 bg-white border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2">
                  <button
                    onClick={() => { setSelectedClass(''); setShowClassDropdown(false); }}
                    className="w-full px-5 py-4 text-left hover:bg-primary/5 flex items-center gap-3 text-xs font-bold transition-colors"
                  >
                    All Classes
                  </button>
                  {classesList.map((cls) => (
                    <button
                      key={cls.id}
                      onClick={() => { setSelectedClass(cls.name); setShowClassDropdown(false); }}
                      className="w-full px-5 py-4 text-left hover:bg-primary/5 flex items-center gap-3 text-xs font-bold transition-colors"
                    >
                      {cls.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Box */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Quick Search</label>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name or Index #..."
                className="w-full pl-12 pr-5 py-3.5 bg-white border border-border rounded-2xl text-[13px] font-black focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="glass-card rounded-[32px] overflow-hidden border-glow shadow-sm border border-border/50">
        <div className="p-6 border-b border-border/50 bg-surface/30 px-8 flex justify-between items-center">
            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Select Student to Sanction</h2>
            <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{filteredStudents.length} STUDENTS</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface/10 text-[10px] uppercase font-black text-muted-foreground tracking-widest border-b border-border/20">
               <tr>
                  <th className="px-8 py-5">Student Identity</th>
                  <th className="px-8 py-5">Class</th>
                  <th className="px-8 py-5 text-right">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="group hover:bg-red-50/10 transition-all">
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-surface border border-border flex items-center justify-center text-primary font-black text-xs shadow-inner">
                             {(student.full_name || student.name || 'S').charAt(0)}
                          </div>
                          <div>
                             <p className="font-black text-[13px] text-foreground">{student.full_name || student.name}</p>
                             <p className="text-[10px] font-bold text-muted-foreground uppercase">{student.student_id || `#${student.id}`}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <p className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">{student.class_name || student.class || 'N/A'}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button
                         onClick={() => {
                           setSelectedStudent(student);
                           setShowDeductModal(true);
                         }}
                         className="px-5 py-2.5 bg-red-600 text-white text-[10px] font-black rounded-xl hover:bg-red-700 transition-all shadow-lg uppercase tracking-widest"
                       >
                         Deduct
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={3} className="px-8 py-20 text-center text-muted-foreground italic font-bold">
                      {allStudents.length === 0 ? 'Loading students...' : `No matches found in ${selectedClass || 'Registry'}.`}
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sanction Modal */}
      {showDeductModal && selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setShowDeductModal(false)} />
           <div className="relative w-full max-w-2xl bg-surface rounded-[40px] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
             <div className="p-8 border-b border-border/50 bg-white/50 flex justify-between items-start">
               <div className="flex gap-5 items-center">
                  <div className="h-14 w-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600 shadow-inner"><MinusCircle className="h-7 w-7" /></div>
                  <div>
                    <h3 className="text-xl font-black text-foreground">Sanction Record</h3>
                    <p className="text-xs font-bold text-muted-foreground uppercase mt-1">
                      {selectedStudent.full_name || selectedStudent.name} • {selectedStudent.student_id || `#${selectedStudent.id}`}
                    </p>
                    {selectedStudent.parent_name && (
                      <p className="text-[10px] text-orange-600 font-bold mt-0.5">
                        Parent: {selectedStudent.parent_name} ({selectedStudent.parent_phone || 'No phone'}) — will be notified
                      </p>
                    )}
                  </div>
               </div>
               <button onClick={() => setShowDeductModal(false)} className="p-2 hover:bg-white rounded-2xl transition-colors"><X className="h-5 w-5" /></button>
             </div>

             <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Sanction Date</label>
                   <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                      <input
                        type="date"
                        value={deductDate}
                        onChange={e => setDeductDate(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-2xl text-xs font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                      />
                   </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Points to Deduct *</label>
                   <div className="relative">
                      <AlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                      <input
                        type="number"
                        value={deductPoints}
                        onChange={e => setDeductPoints(e.target.value)}
                        placeholder="e.g. 5"
                        min="1" max="100"
                        className="w-full pl-11 pr-4 py-3 bg-white border border-red-300 rounded-2xl text-xs font-black focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
                      />
                   </div>
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Violation Category *</label>
                 <select
                   value={deductCategory}
                   onChange={e => setDeductCategory(e.target.value)}
                   className="w-full px-5 py-3.5 bg-white border border-border rounded-2xl text-xs font-black focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none"
                 >
                    <option value="">Choose a violation...</option>
                    <option>Punctuality &amp; Lateness</option>
                    <option>Uniform &amp; Appearance</option>
                    <option>Academic Honesty</option>
                    <option>Property Misuse</option>
                    <option>Behavioral Conduct</option>
                    <option>Device Violation</option>
                 </select>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Incident Report *</label>
                 <div className="relative">
                    <FileText className="absolute left-5 top-5 h-4 w-4 text-muted-foreground opacity-40" />
                    <textarea
                      value={deductReason}
                      onChange={e => setDeductReason(e.target.value)}
                      placeholder="Describe the incident in detail..."
                      rows={4}
                      className="w-full pl-12 pr-6 py-5 bg-white border border-border rounded-3xl text-sm font-medium focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-inner"
                    />
                 </div>
               </div>

               <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                 <p className="text-xs text-orange-700 font-bold">
                   ⚠️ This action will deduct <strong>{deductPoints || '?'} marks</strong> from the student's record and automatically send a notification to their parent.
                 </p>
               </div>
             </div>

             <div className="p-8 bg-surface/50 border-t border-border/50 flex flex-col md:flex-row justify-end gap-3">
               <button
                 onClick={() => { setShowDeductModal(false); setSelectedStudent(null); }}
                 className="flex-1 md:flex-none px-8 py-3.5 text-xs font-black text-muted-foreground hover:bg-white rounded-2xl transition-all uppercase tracking-widest"
               >
                 Discard
               </button>
               <button
                 onClick={handleFinalize}
                 disabled={isSubmitting}
                 className="flex-1 md:flex-none px-10 py-3.5 bg-red-600 text-white text-xs font-black rounded-2xl hover:bg-red-700 shadow-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
               >
                 <CheckCircle2 className="h-4 w-4" />
                 {isSubmitting ? 'Processing...' : 'Finalize & Notify Parent'}
               </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
