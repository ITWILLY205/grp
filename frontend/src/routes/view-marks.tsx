import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Search, User, GraduationCap, Award } from "lucide-react";

export const Route = createFileRoute("/view-marks")({
  component: ViewMarksPage,
  head: () => ({
    meta: [
      { title: "View Marks — SMS" },
      { name: "description", content: "Check your academic marks and results." },
    ],
  }),
});

type MarksResult = {
  subject: string;
  score: number;
  grade: string;
};

const mockResults: MarksResult[] = [
  { subject: "Mathematics", score: 85, grade: "A" },
  { subject: "English", score: 78, grade: "B+" },
  { subject: "Physics", score: 92, grade: "A+" },
  { subject: "Chemistry", score: 70, grade: "B" },
  { subject: "Biology", score: 88, grade: "A" },
  { subject: "History", score: 75, grade: "B+" },
];

function ViewMarksPage() {
  const [fullName, setFullName] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName && indexNumber && classLevel) {
      setShowResults(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">View Academic Marks</h1>
            <p className="text-muted-foreground">
              Enter your student details to access your academic performance report
            </p>
          </div>

          {!showResults ? (
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <Search className="w-4 h-4" />
                    Index Number
                  </label>
                  <input
                    type="text"
                    value={indexNumber}
                    onChange={(e) => setIndexNumber(e.target.value)}
                    placeholder="Enter your index number"
                    required
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <Award className="w-4 h-4" />
                    Class / Level
                  </label>
                  <input
                    type="text"
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value)}
                    placeholder="e.g. Form 3, Level 200"
                    required
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  View Academic Results
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-gradient-to-r from-primary/5 to-primary/10 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Student Information</h2>
                    <p className="text-sm text-muted-foreground">Academic Performance Report</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-background/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Student Name</p>
                    <p className="font-medium text-foreground">{fullName}</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Index Number</p>
                    <p className="font-medium text-foreground">{indexNumber}</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Class / Level</p>
                    <p className="font-medium text-foreground">{classLevel}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Academic Results
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface/50">
                      <tr>
                        <th className="px-6 py-4 text-left font-medium text-foreground">Subject</th>
                        <th className="px-6 py-4 text-center font-medium text-foreground">Score</th>
                        <th className="px-6 py-4 text-center font-medium text-foreground">Grade</th>
                        <th className="px-6 py-4 text-center font-medium text-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockResults.map((r, index) => (
                        <tr key={r.subject} className={`border-t border-border hover:bg-surface/30 transition-colors ${index % 2 === 0 ? 'bg-background/50' : ''}`}>
                          <td className="px-6 py-4 text-foreground font-medium">{r.subject}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-foreground font-semibold">{r.score}</span>
                              <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${r.score >= 80 ? 'bg-green-500' : r.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${r.score}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                              r.grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                              r.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {r.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              r.score >= 80 ? 'bg-green-100 text-green-700' :
                              r.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {r.score >= 80 ? 'Excellent' : r.score >= 60 ? 'Good' : 'Needs Improvement'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-surface/30 px-6 py-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Average Score: <span className="font-semibold text-foreground">
                        {Math.round(mockResults.reduce((acc, r) => acc + r.score, 0) / mockResults.length)}%
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Overall Grade: <span className="font-semibold text-primary">B+</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowResults(false)}
                  className="flex-1 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-surface transition-colors flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search Another Student
                </button>
                <button className="flex-1 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  <Award className="w-4 h-4" />
                  Download Report
                </button>
              </div>
            </div>
        )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
