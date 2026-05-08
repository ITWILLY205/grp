import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Reply, Trash2, User, Clock } from "lucide-react";

export const Route = createFileRoute("/teacher/messages")({
  component: TeacherMessages,
});

interface Message {
  id: number;
  sender: string;
  recipient: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: "received" | "sent";
}

function TeacherMessages() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "Admin",
      recipient: "Sarah Chen",
      subject: "Meeting Schedule Update",
      content: "Please note that tomorrow's staff meeting has been moved to 3 PM in the main conference room.",
      timestamp: "2024-04-25 09:30 AM",
      isRead: false,
      type: "received"
    },
    {
      id: 2,
      sender: "Julia Kim",
      recipient: "Sarah Chen",
      subject: "Math Assignment Question",
      content: "I'm having trouble with question 5 on the calculus homework. Can you explain it during class?",
      timestamp: "2024-04-25 08:15 AM",
      isRead: true,
      type: "received"
    },
    {
      id: 3,
      sender: "Sarah Chen",
      recipient: "Form 3 Students",
      subject: "Quiz Reminder",
      content: "Don't forget about the math quiz tomorrow. Study chapters 4-6.",
      timestamp: "2024-04-24 04:00 PM",
      isRead: true,
      type: "sent"
    },
    {
      id: 4,
      sender: "Kevin Zhang",
      recipient: "Sarah Chen",
      subject: "Absent Today",
      content: "I won't be able to attend class today due to illness. Can you send me the homework?",
      timestamp: "2024-04-24 07:30 AM",
      isRead: true,
      type: "received"
    }
  ]);

  const [newMessage, setNewMessage] = useState({
    recipient: "",
    subject: "",
    content: ""
  });

  const [showCompose, setShowCompose] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.recipient && newMessage.subject && newMessage.content) {
      const message: Message = {
        id: messages.length + 1,
        sender: "Sarah Chen",
        recipient: newMessage.recipient,
        subject: newMessage.subject,
        content: newMessage.content,
        timestamp: new Date().toLocaleString(),
        isRead: true,
        type: "sent"
      };

      setMessages([message, ...messages]);
      setNewMessage({ recipient: "", subject: "", content: "" });
      setShowCompose(false);
      alert("Message sent successfully!");
    }
  };

  const handleDeleteMessage = (id: number) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  const handleMarkAsRead = (id: number) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, isRead: true } : msg
    ));
  };

  const unreadCount = messages.filter(msg => !msg.isRead && msg.type === "received").length;

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-6xl px-6 pt-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
          <div className="flex items-center gap-4">
            {unreadCount > 0 && (
              <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {unreadCount} unread
              </div>
            )}
            <button
              onClick={() => setShowCompose(!showCompose)}
              className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Compose
            </button>
          </div>
        </div>

        {/* Compose Message */}
        {showCompose && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">New Message</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient
                </label>
                <select
                  value={newMessage.recipient}
                  onChange={(e) => setNewMessage({ ...newMessage, recipient: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Recipient</option>
                  <option value="Form 1 Students">Form 1 Students</option>
                  <option value="Form 2 Students">Form 2 Students</option>
                  <option value="Form 3 Students">Form 3 Students</option>
                  <option value="Form 4 Students">Form 4 Students</option>
                  <option value="Form 5 Students">Form 5 Students</option>
                  <option value="Form 6 Students">Form 6 Students</option>
                  <option value="Admin">Admin</option>
                  <option value="All Teachers">All Teachers</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  placeholder="Enter subject"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                  placeholder="Type your message here..."
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.recipient || !newMessage.subject || !newMessage.content}
                  className="bg-primary text-white rounded-lg px-6 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
                <button
                  onClick={() => setShowCompose(false)}
                  className="bg-gray-200 text-gray-700 rounded-lg px-6 py-2 text-sm font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages List */}
        <div className="space-y-3">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`border rounded-lg p-4 transition-colors ${
                  message.type === "received" 
                    ? message.isRead 
                      ? "bg-white border-gray-200" 
                      : "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {message.type === "received" ? message.sender : `To: ${message.recipient}`}
                        </p>
                        {!message.isRead && message.type === "received" && (
                          <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-700">{message.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {message.timestamp}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{message.content}</p>
                <div className="flex items-center gap-2">
                  {message.type === "received" && !message.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(message.id)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <Reply className="h-3 w-3" />
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600">No messages yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
