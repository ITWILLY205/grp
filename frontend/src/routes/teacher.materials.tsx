import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, Plus, FileText, X, Video, Image, File, Radio, Users, Clock, Mic, MicOff, Monitor, MonitorOff } from "lucide-react";

export const Route = createFileRoute("/teacher/materials")({
  component: TeacherMaterials,
});

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

function TeacherMaterials() {
  const [activeTab, setActiveTab] = useState<"quiz" | "upload" | "live">("quiz");
  const [liveTitle, setLiveTitle] = useState("");
  const [liveSubject, setLiveSubject] = useState("");
  const [liveClass, setLiveClass] = useState("");
  const [liveDate, setLiveDate] = useState("");
  const [liveTime, setLiveTime] = useState("");
  const [liveDuration, setLiveDuration] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizSubject, setQuizSubject] = useState("");
  const [quizClass, setQuizClass] = useState("");
  const [quizMarks, setQuizMarks] = useState<number>(100);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState("");

  const MAX_FILE_SIZE = 80 * 1024 * 1024; // 80MB in bytes

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(extension || '')) {
      return Video;
    } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
      return Image;
    } else if (['pdf'].includes(extension || '')) {
      return FileText;
    } else {
      return File;
    }
  };

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(extension || '')) {
      return 'Video';
    } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
      return 'Image';
    } else if (['pdf'].includes(extension || '')) {
      return 'PDF';
    } else if (['doc', 'docx'].includes(extension || '')) {
      return 'Document';
    } else {
      return 'File';
    }
  };

  const handleAddQuestion = () => {
    if (currentQuestion.question && currentQuestion.options.every(opt => opt.trim() !== "")) {
      setQuestions([...questions, currentQuestion]);
      setCurrentQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0
      });
    }
  };

  const handleSaveQuiz = () => {
    if (quizTitle && quizSubject && quizClass && questions.length > 0 && quizMarks > 0) {
      console.log("Saving quiz:", { quizTitle, quizSubject, quizClass, quizMarks, questions });
      alert("Quiz saved successfully!");
      setQuizTitle("");
      setQuizSubject("");
      setQuizClass("");
      setQuizMarks(100);
      setQuestions([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadError("");
    
    const validFiles: File[] = [];
    const oversizedFiles: string[] = [];

    files.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        oversizedFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (oversizedFiles.length > 0) {
      setUploadError(`The following files exceed the 80MB limit: ${oversizedFiles.join(", ")}`);
    }

    setUploadedFiles([...uploadedFiles, ...validFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleUploadFiles = () => {
    if (uploadedFiles.length > 0) {
      console.log("Uploading files:", uploadedFiles);
      alert(`${uploadedFiles.length} file(s) uploaded successfully!`);
      setUploadedFiles([]);
    }
  };

  const handleStartLive = () => {
    if (liveTitle && liveSubject && liveClass && liveDate && liveTime) {
      setIsLive(true);
      console.log("Starting live session:", { liveTitle, liveSubject, liveClass, liveDate, liveTime, liveDuration });
      alert("Live session started successfully!");
    }
  };

  const handleStopLive = () => {
    setIsLive(false);
    setIsMuted(false);
    setIsScreenSharing(false);
    alert("Live session ended!");
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-6xl px-6 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Learning Materials</h2>
        
        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab("quiz")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "quiz"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Create Quiz
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "upload"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Upload Files
          </button>
          <button
            onClick={() => setActiveTab("live")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "live"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Live Session
          </button>
        </div>

        {/* Quiz Creation Tab */}
        {activeTab === "quiz" && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quiz Title
                  </label>
                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="Enter quiz title"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    value={quizSubject}
                    onChange={(e) => setQuizSubject(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                    <option value="History">History</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class
                  </label>
                  <select
                    value={quizClass}
                    onChange={(e) => setQuizClass(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Class</option>
                    <option value="Form 1">Form 1</option>
                    <option value="Form 2">Form 2</option>
                    <option value="Form 3">Form 3</option>
                    <option value="Form 4">Form 4</option>
                    <option value="Form 5">Form 5</option>
                    <option value="Form 6">Form 6</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Marks (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={quizMarks}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      if (value >= 0 && value <= 100) {
                        setQuizMarks(value);
                      }
                    }}
                    placeholder="100"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Question Form */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Question</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                  </label>
                  <textarea
                    value={currentQuestion.question}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                    placeholder="Enter your question"
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Option {index + 1}
                      </label>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...currentQuestion.options];
                          newOptions[index] = e.target.value;
                          setCurrentQuestion({ ...currentQuestion, options: newOptions });
                        }}
                        placeholder={`Option ${index + 1}`}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correct Answer
                  </label>
                  <select
                    value={currentQuestion.correctAnswer}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: parseInt(e.target.value) })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value={0}>Option 1</option>
                    <option value={1}>Option 2</option>
                    <option value={2}>Option 3</option>
                    <option value={3}>Option 4</option>
                  </select>
                </div>
                <button
                  onClick={handleAddQuestion}
                  className="w-full bg-primary text-white rounded-lg px-6 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Question
                </button>
              </div>
            </div>

            {/* Questions List */}
            {questions.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions ({questions.length})</h3>
                <div className="space-y-3">
                  {questions.map((q, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="font-medium text-gray-900 mb-2">{index + 1}. {q.question}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {q.options.map((opt, optIndex) => (
                          <p key={optIndex} className={`text-gray-600 ${optIndex === q.correctAnswer ? 'text-green-600 font-medium' : ''}`}>
                            {optIndex === q.correctAnswer ? '✓ ' : ''}{opt}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Quiz Button */}
            <button
              onClick={handleSaveQuiz}
              disabled={!quizTitle || !quizSubject || !quizClass || questions.length === 0}
              className="w-full bg-primary text-white rounded-lg px-6 py-3 text-sm font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Quiz
            </button>
          </div>
        )}

        {/* File Upload Tab */}
        {activeTab === "upload" && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Study Materials</h3>
              <p className="text-sm text-gray-600 mb-4">Maximum file size: 80MB. Supported formats: PDF, Documents, Videos, Images</p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm font-medium text-gray-900 mb-2">Drag and drop files here</p>
                <p className="text-xs text-gray-500 mb-4">PDF, DOC, DOCX, MP4, AVI, MOV, JPG, PNG, etc.</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.mp4,.avi,.mov,.mkv,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block bg-primary text-white rounded-lg px-6 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Browse Files
                </label>
              </div>

              {uploadError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{uploadError}</p>
                </div>
              )}
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Files to Upload ({uploadedFiles.length})</h3>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => {
                    const FileIcon = getFileIcon(file.name);
                    return (
                      <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <FileIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{getFileType(file.name)} • {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Upload Button */}
            {uploadedFiles.length > 0 && (
              <button
                onClick={handleUploadFiles}
                className="w-full bg-primary text-white rounded-lg px-6 py-3 text-sm font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Files
              </button>
            )}
          </div>
        )}

        {/* Live Session Tab */}
        {activeTab === "live" && (
          <div className="space-y-6">
            {!isLive ? (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Live Session</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Title
                    </label>
                    <input
                      type="text"
                      value={liveTitle}
                      onChange={(e) => setLiveTitle(e.target.value)}
                      placeholder="Enter session title"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                      value={liveSubject}
                      onChange={(e) => setLiveSubject(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Subject</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="English">English</option>
                      <option value="History">History</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class
                    </label>
                    <select
                      value={liveClass}
                      onChange={(e) => setLiveClass(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Class</option>
                      <option value="Form 1">Form 1</option>
                      <option value="Form 2">Form 2</option>
                      <option value="Form 3">Form 3</option>
                      <option value="Form 4">Form 4</option>
                      <option value="Form 5">Form 5</option>
                      <option value="Form 6">Form 6</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={liveDuration}
                      onChange={(e) => setLiveDuration(e.target.value)}
                      placeholder="60"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={liveDate}
                      onChange={(e) => setLiveDate(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={liveTime}
                      onChange={(e) => setLiveTime(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  onClick={handleStartLive}
                  disabled={!liveTitle || !liveSubject || !liveClass || !liveDate || !liveTime}
                  className="mt-6 w-full bg-primary text-white rounded-lg px-6 py-3 text-sm font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Radio className="h-4 w-4" />
                  Start Live Session
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Live Session Active</h3>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-red-600">LIVE</span>
                  </div>
                </div>
                
                <div className="bg-black rounded-lg aspect-video mb-6 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Video className="mx-auto h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium">{liveTitle}</p>
                    <p className="text-sm opacity-70">{liveSubject} • {liveClass}</p>
                    {isScreenSharing && (
                      <div className="mt-2 flex items-center justify-center gap-2 text-green-400">
                        <Monitor className="h-4 w-4" />
                        <span className="text-xs">Screen Sharing</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-4 mb-6">
                  <button
                    onClick={handleToggleMute}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      isMuted 
                        ? "bg-red-100 text-red-700 hover:bg-red-200" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    {isMuted ? "Unmute" : "Mute"}
                  </button>
                  <button
                    onClick={handleToggleScreenShare}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      isScreenSharing 
                        ? "bg-green-100 text-green-700 hover:bg-green-200" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {isScreenSharing ? <MonitorOff className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
                    {isScreenSharing ? "Stop Sharing" : "Share Screen"}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <Users className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-xs text-gray-500">Viewers</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <Clock className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{liveDuration}</p>
                    <p className="text-xs text-gray-500">Minutes</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <Radio className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                    <p className="text-2xl font-bold text-gray-900">HD</p>
                    <p className="text-xs text-gray-500">Quality</p>
                  </div>
                </div>

                <button
                  onClick={handleStopLive}
                  className="w-full bg-red-600 text-white rounded-lg px-6 py-3 text-sm font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                >
                  <X className="h-4 w-4" />
                  End Live Session
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
