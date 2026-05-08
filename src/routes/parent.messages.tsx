import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";

export const Route = createFileRoute("/parent/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">Chat with teachers, announcements, and notifications</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Messages & Communication</h3>
        <p className="text-sm text-blue-700">Chat with teachers, announcements, and notifications</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Messages</h2>
          <div className="space-y-3">
            {[
              { sender: "Mr. Smith (Math)", message: "Please review the homework assignment", time: "2 hours ago" },
              { sender: "Ms. Johnson (English)", message: "Great progress on the essay", time: "1 day ago" },
              { sender: "School Admin", message: "Parent-Teacher meeting reminder", time: "2 days ago" },
            ].map((msg, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{msg.sender}</p>
                <p className="text-sm text-gray-600">{msg.message}</p>
                <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">School Announcements</h2>
          <div className="space-y-3">
            {[
              { title: "Spring Break Schedule", date: "April 10, 2024" },
              { title: "Mid-Term Exam Dates", date: "April 5, 2024" },
              { title: "Sports Day Announcement", date: "March 28, 2024" },
            ].map((announcement, i) => (
              <div key={i} className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">{announcement.title}</p>
                <p className="text-xs text-blue-700 mt-1">{announcement.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
