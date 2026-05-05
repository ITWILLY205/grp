import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, DataTable, Badge } from "@/components/dashboard/SharedUI";
import { Users, CheckCircle, XCircle, Clock, UserCircle, ArrowLeft, Mail, Phone, Baby, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/parent-requests")({
  component: ParentRequestsPage,
});

interface ParentRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  childName: string;
  childStudentId: string;
  relationship: string;
  address: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

const STORAGE_KEY = "parent_registration_requests";

function ParentRequestsPage() {
  const [requests, setRequests] = useState<ParentRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ParentRequest | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  useEffect(() => {
    // Load requests from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setRequests(JSON.parse(stored));
    }
  }, []);

  const saveRequests = (updated: ParentRequest[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setRequests(updated);
  };

  const handleApprove = (request: ParentRequest) => {
    const updated = requests.map(r => 
      r.id === request.id ? { ...r, status: "approved" as const } : r
    );
    saveRequests(updated);
    
    // Add notification for parent
    const notifications = JSON.parse(localStorage.getItem("parent_notifications") || "[]");
    notifications.push({
      id: Date.now().toString(),
      parentEmail: request.email,
      message: `Your registration has been approved! You can now log in with your email and phone number.`,
      type: "approval",
      read: false,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("parent_notifications", JSON.stringify(notifications));
    
    toast.success(`Approved registration for ${request.fullName}`);
    setSelectedRequest(null);
  };

  const handleReject = (request: ParentRequest, reason?: string) => {
    const updated = requests.map(r => 
      r.id === request.id ? { ...r, status: "rejected" as const } : r
    );
    saveRequests(updated);
    
    // Add notification for parent
    const notifications = JSON.parse(localStorage.getItem("parent_notifications") || "[]");
    notifications.push({
      id: Date.now().toString(),
      parentEmail: request.email,
      message: `Your registration was rejected${reason ? `: ${reason}` : ". Please contact the school for more information."}`,
      type: "rejection",
      read: false,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("parent_notifications", JSON.stringify(notifications));
    
    toast.error(`Rejected registration for ${request.fullName}`);
    setSelectedRequest(null);
  };

  const filteredRequests = requests.filter(r => filter === "all" || r.status === filter);
  const pendingCount = requests.filter(r => r.status === "pending").length;

  return (
    <div>
      <PageHeader
        title="Parent Registration Requests"
        description="Review and manage parent account applications"
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{requests.filter(r => r.status === "approved").length}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{requests.filter(r => r.status === "rejected").length}</p>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{requests.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border hover:bg-surface"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "pending" && pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <DataTable headers={["Parent Name", "Child", "Contact", "Submitted", "Status", "Actions"]}>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <tr key={request.id} className="hover:bg-surface/50 border-b border-border last:border-b-0">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{request.fullName}</p>
                      <p className="text-xs text-muted-foreground capitalize">{request.relationship}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-foreground">{request.childName}</p>
                  <p className="text-xs text-muted-foreground">ID: {request.childStudentId}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{request.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{request.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {new Date(request.submittedAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-4">
                  <Badge
                    variant={
                      request.status === "approved"
                        ? "success"
                        : request.status === "rejected"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {request.status}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      View
                    </button>
                    {request.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(request)}
                          className="px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request)}
                          className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                No {filter !== "all" ? filter : ""} registration requests found.
              </td>
            </tr>
          )}
        </DataTable>
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Registration Details</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <UserCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedRequest.fullName}</h3>
                    <Badge
                      variant={
                        selectedRequest.status === "approved"
                          ? "success"
                          : selectedRequest.status === "rejected"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {selectedRequest.status}
                    </Badge>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedRequest.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedRequest.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedRequest.address}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Baby className="h-4 w-4" />
                    Child Information
                  </h4>
                  <div className="bg-surface rounded-lg p-4 space-y-2">
                    <p><span className="text-muted-foreground">Name:</span> {selectedRequest.childName}</p>
                    <p><span className="text-muted-foreground">Student ID:</span> {selectedRequest.childStudentId}</p>
                    <p><span className="text-muted-foreground">Relationship:</span> {selectedRequest.relationship}</p>
                  </div>
                </div>

                {selectedRequest.status === "pending" && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => handleApprove(selectedRequest)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(selectedRequest)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
