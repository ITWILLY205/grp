import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Permission, usePermissionStore } from "@/lib/permissionStore";
import { 
  FileText, 
  User, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  Send,
  CheckCircle2,
  AlertCircle,
  Plus,
  Eye
} from "lucide-react";

export const Route = createFileRoute('/discipline-master/permission')({
  component: PermissionManagement,
});

function PermissionManagement() {
  const { addPermission, permissions, updatePermissionStatus } = usePermissionStore();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [formData, setFormData] = useState({
    studentName: "",
    classLevel: "",
    reason: "",
    dateOut: "",
    dateIn: "",
    address: "",
    parentNumber: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addPermission({
      studentName: formData.studentName,
      classLevel: formData.classLevel,
      reason: formData.reason,
      dateOut: formData.dateOut,
      dateIn: formData.dateIn,
      address: formData.address,
      parentNumber: formData.parentNumber
    });

    setIsSubmitting(false);
    setShowSuccess(true);
    setFormData({
      studentName: "", classLevel: "", reason: "", dateOut: "", dateIn: "", address: "", parentNumber: ""
    });
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredPermissions = [...permissions].reverse().filter(p => 
    activeTab === 'active' ? p.status === 'active' : p.status === 'returned'
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      {/* Modal for Permission Details */}
      {selectedPermission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-lg rounded-3xl p-8 border-glow shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedPermission(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-surface hover:bg-surface/80 text-muted-foreground transition-all"
            >
              <Plus className="h-5 w-5 rotate-45" />
            </button>

            <div className="flex items-center gap-3 mb-8 border-b border-border/50 pb-4">
              <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold">Permission Details</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Student Name</p>
                  <p className="text-sm font-semibold">{selectedPermission.studentName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Class / Level</p>
                  <p className="text-sm font-semibold">{selectedPermission.classLevel}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Reason for Leave</p>
                <p className="text-sm bg-surface/50 p-4 rounded-2xl border border-border mt-1">{selectedPermission.reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Date Out</p>
                  <p className="text-sm font-semibold flex items-center gap-2 mt-1">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {new Date(selectedPermission.dateOut).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Expected In</p>
                  <p className="text-sm font-semibold flex items-center gap-2 mt-1">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {new Date(selectedPermission.dateIn).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50 space-y-4">
               <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Destination Address</p>
                  <p className="text-sm flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {selectedPermission.address}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Parent Contact</p>
                  <p className="text-sm flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    {selectedPermission.parentNumber}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={() => setSelectedPermission(null)}
                className="w-full bg-secondary text-foreground font-bold py-3.5 rounded-2xl hover:bg-secondary/80 transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Permission <span className="text-gradient">Management</span>
        </h1>
        <p className="text-muted-foreground">Issue and track student leave permissions with full details.</p>
      </div>

      {showSuccess && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl animate-in zoom-in duration-300">
          <CheckCircle2 className="h-5 w-5" />
          <p className="font-semibold">Permission request recorded successfully!</p>
        </div>
      )}

      {/* Form Section */}
      <div className="glass-card rounded-3xl p-8 shadow-sm border-glow">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/50">
          <div className="bg-primary/10 p-2.5 rounded-xl">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">New Permission Request</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2 text-muted-foreground ml-1">
                <User className="h-4 w-4" /> Student Full Name
              </label>
              <input required type="text" name="studentName" value={formData.studentName} onChange={handleInputChange} placeholder="Enter student name" className="w-full bg-surface/50 border border-input rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2 text-muted-foreground ml-1">
                <FileText className="h-4 w-4" /> Class / Level
              </label>
              <input required type="text" name="classLevel" value={formData.classLevel} onChange={handleInputChange} placeholder="e.g. Form 4 North" className="w-full bg-surface/50 border border-input rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold flex items-center gap-2 text-muted-foreground ml-1">
                <AlertCircle className="h-4 w-4" /> Reason for Permission
              </label>
              <textarea required name="reason" rows={3} value={formData.reason} onChange={handleInputChange} placeholder="Detailed reason..." className="w-full bg-surface/50 border border-input rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2 text-muted-foreground ml-1">
                <Clock className="h-4 w-4" /> Date & Time Out
              </label>
              <input required type="datetime-local" name="dateOut" value={formData.dateOut} onChange={handleInputChange} className="w-full bg-surface/50 border border-input rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-primary/20 border-primary outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2 text-muted-foreground ml-1">
                <Calendar className="h-4 w-4" /> Expected Return Date
              </label>
              <input required type="datetime-local" name="dateIn" value={formData.dateIn} onChange={handleInputChange} className="w-full bg-surface/50 border border-input rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-primary/20 border-primary outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2 text-muted-foreground ml-1">
                <MapPin className="h-4 w-4" /> Destination Address
              </label>
              <input required type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Home address" className="w-full bg-surface/50 border border-input rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2 text-muted-foreground ml-1">
                <Phone className="h-4 w-4" /> Parent / Guardian Phone
              </label>
              <input required type="tel" name="parentNumber" value={formData.parentNumber} onChange={handleInputChange} placeholder="+250 78x ..." className="w-full bg-surface/50 border border-input rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button disabled={isSubmitting} type="submit" className="group flex items-center gap-2 bg-hero-gradient text-white font-bold px-8 py-4 rounded-2xl hover:glow-primary transition-all active:scale-95 disabled:opacity-50">
              {isSubmitting ? "Processing..." : <><Send className="h-5 w-5 group-hover:translate-x-1" /> Submit Permission</>}
            </button>
          </div>
        </form>
      </div>

      {/* History Section */}
      <div className="glass-card rounded-3xl p-8 border-glow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h3 className="text-lg font-bold">Permission History</h3>
          <div className="flex bg-surface p-1 rounded-xl w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab('active')}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'active' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Active
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'completed' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="pb-4 font-semibold">Student</th>
                <th className="pb-4 font-semibold">Reason / Address</th>
                <th className="pb-4 font-semibold">Timeline</th>
                <th className="pb-4 font-semibold">Status</th>
                <th className="pb-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredPermissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    No {activeTab} permissions found.
                  </td>
                </tr>
              ) : (
                filteredPermissions.map((p) => {
                  const isOverdue = p.status === 'active' && new Date(p.dateIn) < new Date();
                  return (
                    <tr 
                      key={p.id} 
                      onClick={() => setSelectedPermission(p)}
                      className="hover:bg-surface/50 transition-colors group cursor-pointer"
                    >
                      <td className="py-4">
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors">{p.studentName}</div>
                        <div className="text-xs text-muted-foreground">{p.classLevel}</div>
                      </td>
                      <td className="py-4">
                        <div className="text-sm font-medium text-foreground truncate max-w-[150px]">{p.reason}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[150px]">{p.address}</div>
                      </td>
                      <td className="py-4">
                        <div className="text-xs font-semibold text-foreground">Out: {new Date(p.dateOut).toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground">In: {new Date(p.dateIn).toLocaleDateString()}</div>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          isOverdue ? "bg-red-50 text-red-700 border-red-100" : p.status === "returned" ? "bg-green-50 text-green-700 border-green-100" : "bg-blue-50 text-blue-700 border-blue-100"
                        }`}>
                          {isOverdue ? "Overdue" : p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        {p.status === 'active' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              updatePermissionStatus(p.id, 'returned');
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-all bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 hover:border-primary/30"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Completed
                          </button>
                        )}
                        {p.status === 'returned' && (
                          <span className="text-xs text-green-600 font-medium italic uppercase flex items-center justify-end gap-1">
                            <Eye className="h-3 w-3" />
                            Viewed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
