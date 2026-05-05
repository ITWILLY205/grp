import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/teacher/attendance")({
  component: TeacherAttendance,
});

import { academicApi, peopleApi } from "@/lib/api";
import { useEffect } from "react";
import { toast } from "sonner";
import { sendSMSNotification } from "@/utils/smsService";

function TeacherAttendance() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [classesList, setClassesList] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await academicApi.getClasses();
      setClassesList(response.data);
    } catch (error) {
      toast.error("Failed to load classes");
    }
  };

  const fetchStudentsForClass = async (className: string) => {
    try {
      const response = await peopleApi.getStudents();
      const filtered = response.data.filter((s: any) => (s.class_name || s.class) === className);
      setStudents(filtered);
    } catch (error) {
      toast.error("Failed to load students");
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsForClass(selectedClass);
    }
  }, [selectedClass]);

  const [attendance, setAttendance] = useState<Record<number, "present" | "absent">>({});

  const toggleAttendance = (studentId: number) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === "present" ? "absent" : "present"
    }));
  };

  const handleSaveAttendance = () => {
    // Notify parents of any absent students
    Object.entries(attendance).forEach(([strId, status]) => {
      if (status === "absent") {
        const studentId = parseInt(strId);
        const student = students.find(s => s.id === studentId);
        if (student) {
          const parentPhone = student.phone; // Using student's phone or guardian's if added to schema
          const parentName = "Parent/Guardian";
          if (parentPhone) {
            sendSMSNotification(
              parentPhone,
              parentName,
              `ATTENDANCE ALERT: ${student.full_name || student.name} was marked absent today (${selectedDate}).`
            );
          }
        }
      }
    });

    console.log("Saving attendance:", { selectedClass, selectedDate, attendance });
    toast.success("Attendance saved successfully!");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Attendance Form */}
      <div className="w-full max-w-6xl px-6 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Attendance</h2>
        
        <div className="flex flex-wrap items-end gap-6 justify-center">
          {/* Class Selection */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Class</option>
              {classesList.map(cls => (
                <option key={cls.id} value={cls.name}>{cls.name}</option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Student List Display */}
        {selectedClass && (
          <div className="mt-12">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Students in {selectedClass}
                </h3>
              </div>
              <div className="space-y-2">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    <p className="font-medium text-gray-900">{student.full_name || student.name}</p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleAttendance(student.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          attendance[student.id] === "present" 
                            ? "bg-green-100 text-green-700 hover:bg-green-200" 
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => toggleAttendance(student.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          attendance[student.id] === "absent" 
                            ? "bg-red-100 text-red-700 hover:bg-red-200" 
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {students.length} students found
                </div>
                <button
                  onClick={handleSaveAttendance}
                  className="bg-primary text-white rounded-lg px-6 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Save Attendance
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
