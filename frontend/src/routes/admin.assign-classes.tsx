import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Users } from "lucide-react";

// Import the same teachers data
const teachersData = [
  { 
    id: 1, 
    indexNumber: "TCH-001", 
    name: "John Mugabo", 
    department: "Science",
    subjects: ["Mathematics", "Physics"],
    classes: ["Form 3", "Form 4"],
  },
  { 
    id: 2, 
    indexNumber: "TCH-002", 
    name: "Sarah Uwimana", 
    department: "Science",
    subjects: ["Chemistry", "Biology"],
    classes: ["Form 2", "Form 3"],
  },
  { 
    id: 3, 
    indexNumber: "TCH-003", 
    name: "David Habimana", 
    department: "Languages",
    subjects: ["English", "Literature"],
    classes: ["Form 1", "Form 2"],
  },
  { 
    id: 4, 
    indexNumber: "TCH-004", 
    name: "Grace Mukamana", 
    department: "Social Studies",
    subjects: ["History", "Geography"],
    classes: ["Form 4", "Form 5"],
  },
];

const availableSubjects = [
  "Mathematics", "Physics", "Chemistry", "Biology", "English", "Literature",
  "History", "Geography", "Kinyarwanda", "French", "Computer Science"
];

const availableClasses = [
  "Form 1", "Form 2", "Form 3", "Form 4", "Form 5", "Form 6"
];

export const Route = createFileRoute("/admin/assign-classes")({
  component: AssignClasses,
});

function AssignClasses() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const teacherId = parseInt(urlParams.get('id') || '1');
  
  const teacher = teachersData.find(t => t.id === teacherId);
  const [selectedSubjects, setSelectedSubjects] = useState(teacher?.subjects || []);
  const [selectedClasses, setSelectedClasses] = useState(teacher?.classes || []);
  
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

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleClassToggle = (cls: string) => {
    setSelectedClasses(prev => 
      prev.includes(cls) 
        ? prev.filter(c => c !== cls)
        : [...prev, cls]
    );
  };

  const handleAssign = () => {
    if (selectedSubjects.length === 0 || selectedClasses.length === 0) {
      alert("Please select at least one subject and one class");
      return;
    }
    
    // Update teacher data
    const index = teachersData.findIndex(t => t.id === teacher.id);
    if (index > -1) {
      teachersData[index].subjects = selectedSubjects;
      teachersData[index].classes = selectedClasses;
      alert(`Classes assigned successfully!\n\nSubjects: ${selectedSubjects.join(", ")}\nClasses: ${selectedClasses.join(", ")}`);
      navigate({ to: "/admin/teachers" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mx-auto px-6 pt-8 pb-12">
        <div className="mb-6">
          <button
            onClick={() => navigate({ to: "/admin/teachers" })}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Teachers
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Assign Classes & Subjects</h1>
          <p className="text-gray-600 mt-2">Update teaching assignments for {teacher.name}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {/* Teacher Information */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                {teacher.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                <p className="text-sm text-gray-600">{teacher.indexNumber} • {teacher.department}</p>
                <div className="flex gap-4 mt-2">
                  <div className="text-sm">
                    <span className="text-gray-500">Current Subjects:</span>
                    <span className="ml-2 font-medium">{teacher.subjects.join(", ")}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Current Classes:</span>
                    <span className="ml-2 font-medium">{teacher.classes.join(", ")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subjects Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Select Subjects to Teach
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableSubjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => handleSubjectToggle(subject)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    selectedSubjects.includes(subject)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
            {selectedSubjects.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Selected Subjects:</strong> {selectedSubjects.join(", ")}
                </p>
              </div>
            )}
          </div>

          {/* Classes Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Select Classes to Assign
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableClasses.map((cls) => (
                <button
                  key={cls}
                  onClick={() => handleClassToggle(cls)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    selectedClasses.includes(cls)
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
            {selectedClasses.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Selected Classes:</strong> {selectedClasses.join(", ")}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAssign}
              disabled={selectedSubjects.length === 0 || selectedClasses.length === 0}
              className={`px-6 py-3 rounded-lg font-medium ${
                selectedSubjects.length > 0 && selectedClasses.length > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Confirm Assignment
            </button>
            <button
              onClick={() => navigate({ to: "/admin/teachers" })}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
