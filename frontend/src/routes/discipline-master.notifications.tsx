import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { studentsData } from "@/lib/mockDatabase";
import { 
  Bell, 
  Shield, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Send,
  Users,
  User,
  Plus,
  X,
  Megaphone,
  Fingerprint,
  ArrowRight
} from "lucide-react";

export const Route = createFileRoute('/discipline-master/notifications')({
  component: NotificationCenter,
});

interface Notification {
  id: number;
  type: 'discipline' | 'permission' | 'attendance' | 'system' | 'broadcast';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  recipient?: string;
  targetType?: 'role' | 'individual';
}

const initialNotifications: Notification[] = [
  { id: 1, type: 'discipline', title: "Behavior Alert", message: "John Doe marks dropped below 20.", time: "10m", isRead: false, priority: 'high' },
  { id: 2, type: 'permission', title: "Overdue Leave", message: "Jane Smith (F4) is 2h late.", time: "2h", isRead: false, priority: 'medium' },
  { id: 3, type: 'attendance', title: "Term 1 Attendance", message: "Successfully recorded for Form 1.", time: "5h", isRead: true, priority: 'low' },
];

function NotificationCenter() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isComposing, setIsComposing] = useState(false);
  
  const [targetType, setTargetType] = useState<'role' | 'individual'>('role');
  const [selectedRole, setSelectedRole] = useState('All Parents');
  const [selectedIndividual, setSelectedIndividual] = useState("");
  const [composeTitle, setComposeTitle] = useState("");
  const [composeMessage, setComposeMessage] = useState("");
  const [composePriority, setComposePriority] = useState<'low' | 'medium' | 'high'>('medium');

  const roles = ["All Teachers", "All Parents", "All Students", "Form 1", "Form 2", "Form 3", "Form 4", "Form 5", "Form 6"];

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    const recipientName = targetType === 'role' ? selectedRole : selectedIndividual;
    const newBroadcast: Notification = {
      id: Date.now(),
      type: 'broadcast',
      title: composeTitle || "System Broadcast",
      message: composeMessage,
      time: "Now",
      isRead: false,
      priority: composePriority,
      recipient: recipientName,
      targetType
    };
    
    setNotifications([newBroadcast, ...notifications]);
    setIsComposing(false);
    setComposeTitle("");
    setComposeMessage("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-500 pb-10">
      {/* Reduced Height Header */}
      <div className="flex justify-between items-center px-4 bg-white/30 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl text-primary"><Bell className="h-5 w-5" /></div>
          <h1 className="text-xl font-black text-foreground tracking-tight">Notification <span className="text-primary">Center</span></h1>
        </div>
        
        <button 
          onClick={() => setIsComposing(true)}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 text-xs shadow-lg hover:scale-105 transition-all"
        >
           <Plus className="h-4 w-4" /> BROADCAST
        </button>
      </div>

      {/* Row Summary Cards - Smaller height */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[ 
           { label: 'Broadcasts', count: notifications.filter(n => n.type === 'broadcast').length, icon: Megaphone, color: 'text-primary bg-primary/5' },
           { label: 'Unread', count: notifications.filter(n => !n.isRead).length, icon: Zap, color: 'text-orange-600 bg-orange-50' },
           { label: 'Resolved', count: 12, icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
           { label: 'Priority', count: notifications.filter(n => n.priority === 'high').length, icon: Shield, color: 'text-red-600 bg-red-50' }
         ].map((stat, i) => (
           <div key={i} className="glass-card p-4 rounded-3xl border-glow flex items-center gap-3">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${stat.color}`}><stat.icon className="h-4 w-4" /></div>
              <div><p className="text-[9px] font-black text-muted-foreground uppercase">{stat.label}</p><h4 className="text-sm font-black">{stat.count}</h4></div>
           </div>
         ))}
      </div>

      <div className="glass-card rounded-[32px] overflow-hidden border-glow shadow-sm bg-white/40">
         <div className="p-5 border-b border-border/50 bg-surface/30 flex justify-between items-center px-8">
            <h2 className="font-black text-sm flex items-center gap-2 uppercase tracking-widest text-muted-foreground"><Clock className="h-4 w-4" /> Recent Activity</h2>
            <button 
               onClick={() => setNotifications(notifications.map(n => ({ ...n, isRead: true })))}
               className="text-[9px] font-black uppercase text-primary hover:underline"
            >
               Mark Read
            </button>
         </div>

         <div className="divide-y divide-border/20">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-6 hover:bg-white/50 transition-all flex gap-5 group relative ${!n.isRead ? 'bg-primary/5' : ''}`}
              >
                 <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                    n.type === 'broadcast' ? 'bg-primary text-white' :
                    n.type === 'discipline' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                 }`}>
                    {n.type === 'broadcast' ? <Send className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                 </div>

                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                       <div>
                          <div className="flex items-center gap-2">
                             <h3 className="font-bold text-sm text-foreground truncate">{n.title}</h3>
                             {n.priority === 'high' && <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />}
                          </div>
                          {n.recipient && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                               <ArrowRight className="h-3 w-3 text-primary" />
                               <span className="text-[9px] font-black text-primary uppercase">To: {n.recipient}</span>
                               <span className="text-[9px] font-bold text-muted-foreground bg-surface px-1.5 py-0.5 rounded uppercase">({n.targetType})</span>
                            </div>
                          )}
                       </div>
                       <span className="text-[9px] font-bold text-muted-foreground flex-shrink-0 ml-2">{n.time}</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground mt-1 line-clamp-1 group-hover:line-clamp-none transition-all">{n.message}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {isComposing && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setIsComposing(false)} />
           <form 
              onSubmit={handleSendNotification}
              className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl border border-border overflow-hidden animate-in slide-in-from-bottom-5 duration-300"
            >
              <div className="p-6 pb-2 flex justify-between items-center">
                 <h2 className="text-lg font-black text-foreground">Compose Broadcast</h2>
                 <button type="button" onClick={() => setIsComposing(false)} className="p-2 hover:bg-surface rounded-xl transition-all"><X className="h-5 w-5" /></button>
              </div>

              <div className="p-6 space-y-5">
                 <div className="flex bg-surface p-1 rounded-2xl border border-border/50">
                    <button 
                       type="button" 
                       onClick={() => setTargetType('role')}
                       className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${targetType === 'role' ? 'bg-white shadow-md text-primary' : 'text-muted-foreground'}`}
                    >
                       ROLE
                    </button>
                    <button 
                       type="button" 
                       onClick={() => setTargetType('individual')}
                       className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${targetType === 'individual' ? 'bg-white shadow-md text-primary' : 'text-muted-foreground'}`}
                    >
                       PERSON
                    </button>
                 </div>

                 <div className="space-y-4">
                    {targetType === 'role' ? (
                       <select 
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="w-full bg-surface border border-border p-3 rounded-xl text-sm font-bold outline-none"
                       >
                          {roles.map(r => <option key={r} value={r}>{r}</option>)}
                       </select>
                    ) : (
                       <input 
                          type="text"
                          placeholder="Search person's name..."
                          value={selectedIndividual}
                          onChange={(e) => setSelectedIndividual(e.target.value)}
                          className="w-full bg-surface border border-border p-3 rounded-xl text-sm font-bold outline-none"
                       />
                    )}

                    <input 
                       type="text" 
                       placeholder="Subject" 
                       value={composeTitle}
                       onChange={(e) => setComposeTitle(e.target.value)}
                       className="w-full border-b border-border p-2 text-sm font-bold outline-none focus:border-primary transition-all"
                       required
                    />
                    <textarea 
                       placeholder="Detailed message..." 
                       value={composeMessage}
                       onChange={(e) => setComposeMessage(e.target.value)}
                       className="w-full bg-surface border border-border p-4 rounded-2xl text-sm outline-none min-h-[100px] resize-none"
                       required
                    />
                 </div>

                 <button 
                    type="submit"
                    className="w-full bg-hero-gradient text-white py-3.5 rounded-2xl font-black text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                 >
                    <Send className="h-4 w-4" /> SEND TO {targetType === 'role' ? selectedRole.toUpperCase() : selectedIndividual.toUpperCase() || 'RECIPIENT'}
                 </button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
}
