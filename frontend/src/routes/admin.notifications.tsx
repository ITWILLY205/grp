import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, DataTable, Badge } from "@/components/dashboard/SharedUI";
import { Bell, Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/notifications")({
  component: AdminNotifications,
});

const notifications = [
  { id: 1, title: "Term 1 Results Published", target: "All Students & Parents", sent: "Apr 14, 2026", status: "sent" },
  { id: 2, title: "Parent-Teacher Meeting — April 20", target: "All Parents", sent: "Apr 12, 2026", status: "sent" },
  { id: 3, title: "School Holiday Announcement", target: "Everyone", sent: "Apr 10, 2026", status: "sent" },
  { id: 4, title: "Sports Day Reminder", target: "All Students", sent: "Apr 8, 2026", status: "sent" },
  { id: 5, title: "Exam Schedule Update", target: "Class 10 & 12", sent: "—", status: "draft" },
];

function AdminNotifications() {
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("all");

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Send and manage notifications for the school"
      />

      {/* Compose */}
      <div className="mb-8 rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-bold">Send Notification</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Target Audience</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full rounded-xl border border-input bg-secondary px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="all">Everyone</option>
              <option value="students">All Students</option>
              <option value="teachers">All Teachers</option>
              <option value="parents">All Parents</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Type your notification message..."
              className="w-full rounded-xl border border-input bg-secondary px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary"
            />
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-hero-gradient px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:glow-primary">
            <Send className="h-4 w-4" />
            Send Notification
          </button>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-bold">Notification History</h2>
      <DataTable headers={["Title", "Target", "Sent", "Status"]}>
        {notifications.map((n) => (
          <tr key={n.id} className="hover:bg-surface/50">
            <td className="px-5 py-3.5 text-sm font-medium">{n.title}</td>
            <td className="px-5 py-3.5 text-sm text-muted-foreground">{n.target}</td>
            <td className="px-5 py-3.5 text-sm text-muted-foreground">{n.sent}</td>
            <td className="px-5 py-3.5">
              <Badge variant={n.status === "sent" ? "success" : "warning"}>{n.status}</Badge>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
