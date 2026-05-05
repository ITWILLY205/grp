import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader, Badge } from "@/components/dashboard/SharedUI";
import { FileText, Video as VideoIcon, HelpCircle, Download, BookOpen } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/student/materials")({
  component: StudentMaterials,
});

const materials = [
  { name: "Algebra Fundamentals.pdf", type: "PDF", subject: "Mathematics", teacher: "Ms. Chen", date: "Apr 14", course: "Mathematics 101", fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
  { name: "Newton's Laws Explained", type: "Video", subject: "Physics", teacher: "Mr. Park", date: "Apr 12", course: "Physics 201", fileUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
  { name: "Chapter 5 Quiz", type: "Quiz", subject: "Biology", teacher: "Ms. Zhao", date: "Apr 10", course: "Biology 101" },
  { name: "Calculus Introduction.pdf", type: "PDF", subject: "Mathematics", teacher: "Ms. Chen", date: "Apr 8", course: "Mathematics 101", fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
  { name: "English Essay Guidelines", type: "PDF", subject: "English", teacher: "Mr. Brown", date: "Apr 6", course: "English 101", fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
  { name: "Chemical Bonding Overview", type: "Video", subject: "Chemistry", teacher: "Ms. Adams", date: "Apr 4", course: "Chemistry 201", fileUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
];

const courses = [
  "All Courses",
  "Mathematics 101",
  "Physics 201", 
  "Biology 101",
  "English 101",
  "Chemistry 201",
];

function StudentMaterials() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState("All Courses");

  const filteredMaterials = selectedCourse === "All Courses" 
    ? materials 
    : materials.filter(m => m.course === selectedCourse);

  const handleStartQuiz = (materialName: string) => {
    navigate({ to: "/student/quiz", search: { materialName } });
  };

  const handleDownload = (material: typeof materials[number]) => {
    if (!material.fileUrl) return;
    const link = document.createElement("a");
    link.href = material.fileUrl;
    link.download = material.name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <PageHeader
        title="Learning Materials"
        description="Access study materials uploaded by your teachers"
      />

      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-600" />
            <label className="text-sm font-medium text-gray-900">Select Course:</label>
          </div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMaterials.map((m, i) => {
          const Icon = m.type === "PDF" ? FileText : m.type === "Video" ? VideoIcon : HelpCircle;
          const iconColor = m.type === "PDF" ? "bg-destructive/10 text-destructive" : m.type === "Video" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent";

          return (
            <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-primary/20">
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <Badge variant={m.type === "Quiz" ? "warning" : m.type === "Video" ? "success" : "default"}>
                  {m.type}
                </Badge>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-gray-900">{m.name}</h3>
              <p className="mt-1 text-xs text-gray-600">{m.subject} · {m.teacher}</p>
              <p className="text-xs text-gray-600">{m.date}</p>
              <p className="text-xs text-blue-600 font-medium">{m.course}</p>
              <button
                onClick={() => m.type === "Quiz" ? handleStartQuiz(m.name) : handleDownload(m)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                {m.type === "Quiz" ? "Start Quiz" : <><Download className="h-4 w-4" /> Download</>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
