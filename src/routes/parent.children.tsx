import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, User, Mail, Phone, MapPin, IdCard } from "lucide-react";
import { getStudentsForParent } from "@/stores/studentData";

export const Route = createFileRoute("/parent/children")({
  component: ChildrenPage,
});

function ChildrenPage() {
  const [selectedChild, setSelectedChild] = useState<number>(1);
  const children = getStudentsForParent("Robert Johnson");
  const selectedChildData = children.find(c => c.id === selectedChild);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Children</h1>
        <p className="text-gray-600 mt-1">Manage and view your children's profiles</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">My Children</h3>
        <p className="text-sm text-blue-700">Switch between children to view their profiles and performance</p>
      </div>

      <div className="flex gap-3">
        {children.map((child) => (
          <button
            key={child.id}
            onClick={() => setSelectedChild(child.id)}
            className={`px-6 py-3 rounded-lg border transition-all ${
              selectedChild === child.id
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-600"
            }`}
          >
            {child.name}
          </button>
        ))}
      </div>

      {/* Child Profile Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-6 mb-8">
          {/* Profile Photo */}
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
            {selectedChildData?.photo ? (
              <img src={selectedChildData.photo} alt={selectedChildData.name} className="w-full h-full object-cover" />
            ) : (
              <Users className="h-12 w-12 text-gray-400" />
            )}
          </div>

          {/* Profile Details */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900">{selectedChildData?.name}</h3>
            <p className="text-gray-600 mt-1">{selectedChildData?.school || "SMS High School"}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div>
                <p className="text-sm text-gray-600">Student ID</p>
                <p className="font-medium text-gray-900">{selectedChildData?.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Index Number</p>
                <p className="font-medium text-gray-900">{selectedChildData?.indexNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Class</p>
                <p className="font-medium text-gray-900">{selectedChildData?.class}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Grade</p>
                <p className="font-medium text-gray-900">{selectedChildData?.grade || selectedChildData?.class}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Section</p>
                <p className="font-medium text-gray-900">{selectedChildData?.section || selectedChildData?.stream}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`font-medium ${selectedChildData?.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{selectedChildData?.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-medium text-gray-900">{selectedChildData?.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium text-gray-900">{selectedChildData?.dob}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Admission Date</p>
                <p className="font-medium text-gray-900">{selectedChildData?.admissionDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{selectedChildData?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{selectedChildData?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">National ID</p>
                <p className="font-medium text-gray-900">{selectedChildData?.nationalId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Guardians Section */}
        {selectedChildData?.guardians && selectedChildData.guardians.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Guardian Information</h4>
            <div className="grid gap-4 md:grid-cols-2">
              {selectedChildData.guardians.map((guardian) => (
                <div key={guardian.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{guardian.name}</p>
                      <p className="text-sm text-gray-600">{guardian.relationship}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <IdCard className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">ID:</span>
                      <span className="font-medium text-gray-900">{guardian.nationalId}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium text-gray-900">{guardian.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-900">{guardian.email}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span className="text-gray-600">Address:</span>
                      <span className="font-medium text-gray-900">{guardian.address}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
