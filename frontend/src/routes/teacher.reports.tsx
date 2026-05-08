import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/teacher/reports")({
  component: TeacherReports,
});

interface StudentSubjectMark {
  name: string;
  mark: number;
}

interface Student {
  id: number;
  name: string;
  class: string;
  subjects: StudentSubjectMark[];
}

const studentsData: Student[] = [];

function TeacherReports() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const getSubjectMark = (student: Student, subjectName: string) => {
    return student.subjects.find(s => s.name === subjectName)?.mark || 0;
  };

  const getOverallAverage = (student: Student) => {
    const total = student.subjects.reduce((acc, s) => acc + s.mark, 0);
    return Math.round(total / student.subjects.length);
  };

  const getFilteredStudents = () => {
    return studentsData.filter(student => student.class === selectedClass);
  };

  const getWeakStudents = () => {
    return getFilteredStudents()
      .filter(student => getOverallAverage(student) < 50)
      .sort((a, b) => getOverallAverage(a) - getOverallAverage(b));
  };

  const getBestPerformers = () => {
    return getFilteredStudents()
      .filter(student => getOverallAverage(student) >= 80)
      .sort((a, b) => getOverallAverage(b) - getOverallAverage(a));
  };

  const getAverageMark = () => {
    const students = getFilteredStudents();
    if (students.length === 0) return 0;
    const marks = students.map(s => getSubjectMark(s, selectedSubject)).filter(m => m > 0);
    if (marks.length === 0) return 0;
    return Math.round(marks.reduce((acc, mark) => acc + mark, 0) / marks.length);
  };

  const showResults = selectedClass && selectedSubject;

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-6xl px-6 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Teacher Reports</h2>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No reports available</p>
        </div>
      </div>
    </div>
  );
}
