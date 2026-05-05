import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/SharedUI";
import { Bell, Award, ClipboardCheck, Megaphone, Calendar, CheckCircle, XCircle, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/parent/notifications")({
  component: ParentNotifications,
});

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  color: string;
  read: boolean;
  icon: any;
  type: string;
}

const STATIC_NOTIFICATIONS: Notification[] = [
  { id: "static-1", icon: Award, title: "Math midterm score: 88% (B+)", message: "Great job!", time: "2 hours ago", color: "bg-primary/10 text-primary", read: false, type: "grade" },
  { id: "static-2", icon: ClipboardCheck, title: "Alice marked present today", message: "Attendance recorded", time: "8 hours ago", color: "bg-chart-5/10 text-chart-5", read: false, type: "attendance" },
  { id: "static-3", icon: Calendar, title: "Parent-Teacher Meeting on April 20 at 3 PM", message: "Please confirm attendance", time: "1 day ago", color: "bg-accent/10 text-accent", read: false, type: "event" },
];

function ParentNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [parentEmail, setParentEmail] = useState<string>("");

  useEffect(() => {
    // Get parent email from session
    const session = JSON.parse(localStorage.getItem("session_user") || "{}");
    const email = session.email || "";
    setParentEmail(email);

    // Load registration notifications for this parent
    const parentNotifs = JSON.parse(localStorage.getItem("parent_notifications") || "[]");
    const myNotifs = parentNotifs.filter((n: any) => n.parentEmail === email);
    
    // Transform to display format
    const formattedNotifs: Notification[] = myNotifs.map((n: any) => ({
      id: n.id,
      title: n.type === "approval" ? "Registration Approved!" : "Registration Rejected",
      message: n.message,
      time: new Date(n.createdAt).toLocaleString(),
      color: n.type === "approval" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600",
      read: n.read,
      icon: n.type === "approval" ? CheckCircle : XCircle,
      type: n.type,
    }));

    // Combine with static notifications
    setNotifications([...formattedNotifs, ...STATIC_NOTIFICATIONS]);
  }, []);

  const markAsRead = (id: string) => {
    // Update in localStorage
    const parentNotifs = JSON.parse(localStorage.getItem("parent_notifications") || "[]");
    const updated = parentNotifs.map((n: any) => 
      n.id === id ? { ...n, read: true } : n
    );
    localStorage.setItem("parent_notifications", JSON.stringify(updated));
    
    // Update local state
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay updated on your child's academic activities and account status"
      />

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((n, i) => (
            <div 
              key={n.id || i} 
              onClick={() => !n.read && markAsRead(n.id)}
              className={`flex items-start gap-4 rounded-2xl border bg-card p-4 transition-colors cursor-pointer ${!n.read ? "border-primary/20 bg-surface" : "border-border"}`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${n.color}`}>
                <n.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className={`text-sm ${!n.read ? "font-semibold" : "font-medium text-muted-foreground"}`}>
                  {n.title}
                </p>
                <p className="text-sm text-foreground mt-0.5">{n.message}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{n.time}</p>
              </div>
              {!n.read && <div className="mt-2 h-2 w-2 rounded-full bg-primary" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
