import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/SharedUI";
import { Bell, Award, ClipboardCheck, Megaphone, Calendar, CheckCircle, XCircle, UserCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { peopleApi } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/parent/notifications")({
  component: ParentNotifications,
});

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  color: string;
  read: boolean;
  icon: any;
  type: string;
}

const STATIC_NOTIFICATIONS: Notification[] = [
  { id: -1, icon: Award, title: "Math midterm score: 88% (B+)", message: "Great job!", time: "2 hours ago", color: "bg-primary/10 text-primary", read: false, type: "grade" },
  { id: -2, icon: ClipboardCheck, title: "Alice marked present today", message: "Attendance recorded", time: "8 hours ago", color: "bg-chart-5/10 text-chart-5", read: false, type: "attendance" },
  { id: -3, icon: Calendar, title: "Parent-Teacher Meeting on April 20 at 3 PM", message: "Please confirm attendance", time: "1 day ago", color: "bg-accent/10 text-accent", read: false, type: "event" },
];

function ParentNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await peopleApi.getParentNotifications();
      const notifs = res.data || [];

      const formatted: Notification[] = notifs.map((n: any) => ({
        id: n.id,
        title: n.title || (n.type === "approval" ? "Registration Approved!" : n.type === "rejection" ? "Registration Rejected" : "Notification"),
        message: n.message,
        time: new Date(n.created_at).toLocaleString(),
        color: n.type === "approval" ? "bg-green-100 text-green-600" : n.type === "rejection" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600",
        read: n.is_read,
        icon: n.type === "approval" ? CheckCircle : n.type === "rejection" ? XCircle : Bell,
        type: n.type,
      }));

      // Combine real notifications with static demo ones
      setNotifications([...formatted, ...STATIC_NOTIFICATIONS]);
    } catch (err) {
      toast.error("Failed to load notifications");
      setNotifications(STATIC_NOTIFICATIONS);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    if (id < 0) return; // Skip static notifications
    try {
      await peopleApi.markParentNotificationRead(id);
      setNotifications(prev => prev.map(n =>
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (err) {
      toast.error("Failed to mark as read");
    }
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
