import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, DataTable } from "@/components/dashboard/SharedUI";
import { useState } from "react";

export const Route = createFileRoute("/admin/manage-academics")({
  component: ManageAcademics,
});

const moduleData = {
  "Mathematics": {
    classes: ["10-A", "10-B", "11-A"],
    teachers: ["Dr. Smith", "Ms. Johnson", "Mr. Brown"],
    oLevel: ["10-A", "10-B"],
    aLevel: ["11-A"]
  },
  "Physics": {
    classes: ["11-B", "12-A"],
    teachers: ["Prof. Davis", "Dr. Wilson"],
    oLevel: [],
    aLevel: ["11-B", "12-A"]
  },
  "Chemistry": {
    classes: ["12-C", "11-A"],
    teachers: ["Dr. Martinez", "Ms. Anderson"],
    oLevel: [],
    aLevel: ["12-C", "11-A"]
  },
  "Biology": {
    classes: ["10-B", "12-A"],
    teachers: ["Dr. Taylor", "Mr. Thomas"],
    oLevel: ["10-B"],
    aLevel: ["12-A"]
  },
  "English": {
    classes: ["9-A", "10-A", "11-B"],
    teachers: ["Ms. White", "Dr. Harris", "Mrs. Clark"],
    oLevel: ["9-A", "10-A"],
    aLevel: ["11-B"]
  },
  "History": {
    classes: ["11-A", "12-B"],
    teachers: ["Prof. Lewis", "Dr. Walker"],
    oLevel: [],
    aLevel: ["11-A", "12-B"]
  },
  "Computer Science": {
    classes: ["12-A", "11-B"],
    teachers: ["Mr. Hall", "Ms. Young"],
    oLevel: [],
    aLevel: ["12-A", "11-B"]
  }
};

const classModuleMapping = {
  "S1": ["Mathematics", "English", "Biology"],
  "S2": ["Mathematics", "English", "Physics"],
  "S3": ["Mathematics", "English", "Chemistry"],
  "S4": ["Physics", "Chemistry", "Computer Science"],
  "S5": ["Physics", "Biology", "History"],
  "S6": ["Chemistry", "Computer Science", "History"]
};

function ManageAcademics() {
  const [classFilter, setClassFilter] = useState("all");
  const [selectedClass, setSelectedClass] = useState("");

  const modules = Object.keys(moduleData);

  const getOrdinaryLevelClasses = () => {
    return ["S1", "S2", "S3"];
  };

  const getAdvancedLevelClasses = () => {
    return ["S4", "S5", "S6"];
  };

  const getClassOptions = () => {
    if (classFilter === "ordinary") {
      return getOrdinaryLevelClasses();
    } else if (classFilter === "advanced") {
      return getAdvancedLevelClasses();
    }
    return [];
  };

  return (
    <div>
      <PageHeader
        title="Academic Management"
        description="Manage courses and classes"
        action={
          <button className="rounded-xl bg-hero-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:glow-primary">
            Add Course
          </button>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Classes
          </label>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Classes</option>
            <option value="ordinary">Ordinary Level</option>
            <option value="advanced">Advanced Level</option>
          </select>
        </div>
        {classFilter !== "all" && (
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
              {getClassOptions().map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Class Details */}
      {selectedClass && (
        <div className="mb-8 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">{selectedClass} Class Modules</h3>
          
          {/* Modules Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-3">Modules Studied</h4>
            <div className="flex flex-wrap gap-2">
              {classModuleMapping[selectedClass as keyof typeof classModuleMapping]?.map((module) => (
                <button
                  key={module}
                  onClick={() => alert(`Module: ${module}\nClass: ${selectedClass}\nTeachers: ${moduleData[module]?.teachers.join(', ') || 'No teachers assigned'}`)}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 hover:text-blue-900 transition-colors cursor-pointer"
                >
                  {module}
                </button>
              )) || <span className="text-gray-500 text-sm">No modules found for this class</span>}
            </div>
          </div>
        </div>
      )}

      {/* General Courses Table */}
      <h2 className="mb-4 text-lg font-bold">All Courses</h2>
      <DataTable headers={["Module", "Classes", "Teachers"]}>
        {modules.map((mod) => {
          const data = moduleData[mod as keyof typeof moduleData];
          return (
            <tr key={mod} className="hover:bg-surface/50">
              <td className="px-5 py-3.5 text-sm font-medium">{mod}</td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground">{data.classes.length}</td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground">{data.teachers.length}</td>
            </tr>
          );
        })}
      </DataTable>
    </div>
  );
}

export default ManageAcademics;
