import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, User, GraduationCap } from "lucide-react";
import { studentsData } from "@/lib/mockDatabase";
import { sendSMSNotification } from "@/utils/smsService";

export const Route = createFileRoute("/admin/deduct-marks")({
  component: DeductMarks,
});

function DeductMarks() {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState("");
  const [studentName, setStudentName] = useState("");
  const [marksToDeduct, setMarksToDeduct] = useState("");
  const [reason, setReason] = useState("");
  const [currentDisciplineMarks, setCurrentDisciplineMarks] = useState(40);

  const classes = ["S1", "S2", "S3", "S4", "S5", "S6"];

  const handleDeductMarks = () => {
    if (!studentName || !marksToDeduct || !reason) {
      alert("Please fill in all fields");
      return;
    }

    const deduction = parseInt(marksToDeduct);
    const newMarks = Math.max(0, currentDisciplineMarks - deduction);

    // Simulated Database Check & SMS Sending
    const student = studentsData.find(
      (s) => s.name.toLowerCase() === studentName.toLowerCase() && (!selectedClass || s.class === selectedClass)
    );

    if (student) {
      const parentPhone = student.guardianPhone || student.fatherPhone || student.motherPhone;
      const parentName = student.guardianName || student.fatherName || student.motherName || "Parent/Guardian";
      if (parentPhone) {
        sendSMSNotification(
          parentPhone,
          parentName,
          `DISCIPLINE ALERT: ${deduction} marks have been deducted from ${student.name}'s discipline record for: ${reason}.`
        );
      }
    } else {
      // Fallback if student not in mock db but we still want to show the SMS toast
      sendSMSNotification(
        "+250780000000",
        "Parent/Guardian",
        `DISCIPLINE ALERT: ${deduction} marks have been deducted from ${studentName}'s discipline record for: ${reason}.`
      );
    }

    alert(`Successfully deducted ${deduction} marks from ${studentName} for: ${reason}`);
    // Store data in sessionStorage for the next page
    sessionStorage.setItem("disciplineData", JSON.stringify({
      studentName,
      class: selectedClass,
      currentMarks: newMarks,
      reason
    }));
    navigate({ to: "/admin/student-discipline" });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate({ to: "/admin/academics" })}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Academics
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Deduct Marks</h1>
          <p className="text-gray-600 mt-2">Enter student details and deduct marks for disciplinary reasons</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Deduct Marks</h2>

            {/* Current Marks Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Current Discipline Marks</p>
                  <p className="text-2xl font-bold text-blue-900">{currentDisciplineMarks}/40</p>
                </div>
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-xs text-blue-600 mt-2">Maximum discipline marks per term: 40</p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student Name *</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter student name"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marks to Deduct *</label>
                <input
                  type="number"
                  value={marksToDeduct}
                  onChange={(e) => setMarksToDeduct(e.target.value)}
                  placeholder="Enter marks to deduct"
                  min="0"
                  max="100"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason *</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide reason for marks deduction"
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setStudentName("");
                    setMarksToDeduct("");
                    setReason("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeductMarks}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Deduct Marks
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
