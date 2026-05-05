import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Mail, Phone, MessageSquare, Send } from "lucide-react";

// Import the same teachers data
const teachersData = [
  { 
    id: 1, 
    indexNumber: "TCH-001", 
    name: "John Mugabo", 
    email: "john.mugabo@school.com",
    phone: "+250788123456",
  },
  { 
    id: 2, 
    indexNumber: "TCH-002", 
    name: "Sarah Uwimana", 
    email: "sarah.uwimana@school.com",
    phone: "+250787234567",
  },
  { 
    id: 3, 
    indexNumber: "TCH-003", 
    name: "David Habimana", 
    email: "david.habimana@school.com",
    phone: "+250789345678",
  },
  { 
    id: 4, 
    indexNumber: "TCH-004", 
    name: "Grace Mukamana", 
    email: "grace.mukamana@school.com",
    phone: "+250786456789",
  },
];

export const Route = createFileRoute("/admin/send-notification")({
  component: SendNotification,
});

function SendNotification() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const teacherId = parseInt(urlParams.get('id') || '1');
  
  const teacher = teachersData.find(t => t.id === teacherId);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [notificationSent, setNotificationSent] = useState(false);
  
  if (!teacher) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Teacher Not Found</h2>
          <p className="text-gray-600 mb-6">The teacher you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate({ to: "/admin/teachers" })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Teachers
          </button>
        </div>
      </div>
    );
  }

  const handleSendNotification = () => {
    if (!message.trim() || !subject.trim()) {
      alert("Please enter both subject and message");
      return;
    }
    setNotificationSent(true);
  };

  const handleComplete = () => {
    alert(`Notification sent successfully!\n\nTo: ${teacher.name}\nEmail: ${teacher.email}\nPhone: ${teacher.phone}\nSubject: ${subject}\nMessage: ${message}\nSent at: ${new Date().toLocaleString()}`);
    navigate({ to: "/admin/teachers" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-3xl mx-auto px-6 pt-8 pb-12">
        <div className="mb-6">
          <button
            onClick={() => navigate({ to: "/admin/teachers" })}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Teachers
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Send Notification</h1>
          <p className="text-gray-600 mt-2">Send a message to {teacher.name}</p>
        </div>

        {!notificationSent ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            {/* Teacher Information */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {teacher.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                  <p className="text-sm text-gray-600">{teacher.indexNumber}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Mail className="h-4 w-4" />
                      {teacher.email}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Phone className="h-4 w-4" />
                      {teacher.phone}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter notification subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Type your message here..."
                />
                <p className="text-sm text-gray-500 mt-1">{message.length} characters</p>
              </div>
            </div>

            {/* Preview */}
            {(subject || message) && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
                <div className="bg-white border border-gray-200 rounded p-3">
                  {subject && (
                    <h5 className="font-medium text-gray-900 mb-2">{subject}</h5>
                  )}
                  {message && (
                    <p className="text-gray-700 whitespace-pre-wrap">{message}</p>
                  )}
                  <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                    To: {teacher.name} • {new Date().toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSendNotification}
                disabled={!message.trim() || !subject.trim()}
                className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${
                  message.trim() && subject.trim()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Send className="h-4 w-4" />
                Send Notification
              </button>
              <button
                onClick={() => navigate({ to: "/admin/teachers" })}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Notification Ready to Send!</h3>
              <p className="text-gray-600 mb-6">
                Your message is ready to be delivered to {teacher.name}.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-left">
                <h4 className="font-medium text-green-800 mb-4">Notification Details:</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-green-600">Recipient:</p>
                    <p className="font-medium text-green-800">{teacher.name} ({teacher.indexNumber})</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Subject:</p>
                    <p className="font-medium text-green-800">{subject}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Message:</p>
                    <p className="font-medium text-green-800">{message}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-green-600">Email:</p>
                      <p className="font-medium text-green-800">{teacher.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Phone:</p>
                      <p className="font-medium text-green-800">{teacher.phone}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-green-300">
                    <p className="text-sm text-green-600">
                      <strong>Prepared at:</strong> {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleComplete}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Send Notification
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
