import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";

type QuizSearch = {
  materialName?: string;
};
import { PageHeader, Badge } from "@/components/dashboard/SharedUI";
import { useState, useEffect, useRef, useCallback } from "react";
import { Clock, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Play, Camera, Mic, Maximize, AlertTriangle, Monitor, Volume2 } from "lucide-react";

/* ---------- Fullscreen helpers ---------- */
function enterFullscreen(el: HTMLElement) {
  const anyEl = el as any;
  if (anyEl.requestFullscreen) anyEl.requestFullscreen();
  else if (anyEl.webkitRequestFullscreen) anyEl.webkitRequestFullscreen();
  else if (anyEl.mozRequestFullScreen) anyEl.mozRequestFullScreen();
  else if (anyEl.msRequestFullscreen) anyEl.msRequestFullscreen();
}
function exitFullscreen() {
  const d = document as any;
  if (d.exitFullscreen) d.exitFullscreen();
  else if (d.webkitExitFullscreen) d.webkitExitFullscreen();
  else if (d.mozCancelFullScreen) d.mozCancelFullScreen();
  else if (d.msExitFullscreen) d.msExitFullscreen();
}
function isFullscreen() {
  const d = document as any;
  return !!(d.fullscreenElement || d.webkitFullscreenElement || d.mozFullScreenElement || d.msFullscreenElement);
}

export const Route = createFileRoute("/student/quiz")({
  component: StudentQuiz,
});

// Sample quiz questions for demonstration
const sampleQuizzes: Record<string, any> = {
  "Chapter 5 Quiz": {
    title: "Chapter 5 Quiz",
    subject: "Biology",
    teacher: "Ms. Zhao",
    duration: 30,
    questions: [
      {
        id: 1,
        question: "What is the process by which plants make their own food called?",
        options: ["Photosynthesis", "Respiration", "Digestion", "Fermentation"],
        correctAnswer: 0,
        type: "multiple-choice"
      },
      {
        id: 2,
        question: "Which organelle is known as the 'powerhouse' of the cell?",
        options: ["Nucleus", "Mitochondria", "Ribosomes", "Golgi apparatus"],
        correctAnswer: 1,
        type: "multiple-choice"
      },
      {
        id: 3,
        question: "What gas do plants release during photosynthesis?",
        options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
        correctAnswer: 1,
        type: "multiple-choice"
      },
      {
        id: 4,
        question: "Which of the following is NOT a characteristic of living things?",
        options: ["Growth", "Reproduction", "Response to stimuli", "Inability to move"],
        correctAnswer: 3,
        type: "multiple-choice"
      },
      {
        id: 5,
        question: "What is the basic unit of life?",
        options: ["Cell", "Tissue", "Organ", "Organ system"],
        correctAnswer: 0,
        type: "multiple-choice"
      }
    ]
  }
};

function StudentQuiz() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/student/quiz" });
  const materialName = decodeURIComponent((search as QuizSearch).materialName || "");
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [cheatReason, setCheatReason] = useState<string | null>(null);
  const [faceCount, setFaceCount] = useState(0);
  const [noiseLevel, setNoiseLevel] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const faceIntervalRef = useRef<any>(null);
  const audioIntervalRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const quizCompletedRef = useRef(false);

  const quiz = sampleQuizzes[materialName];

  useEffect(() => {
    if (!quiz) {
      navigate({ to: "/student/materials" });
      return;
    }
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz("Time expired");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStarted, quizCompleted, timeLeft]);

  /* Fullscreen enforcement */
  useEffect(() => {
    if (!quizStarted || quizCompleted) return;
    const onFs = () => {
      const d = document as any;
      const fs = !!(d.fullscreenElement || d.webkitFullscreenElement || d.mozFullScreenElement || d.msFullscreenElement);
      if (!fs) { handleSubmitQuiz("Fullscreen exited"); }
    };
    const ev = "fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange".split(" ");
    ev.forEach((e) => document.addEventListener(e, onFs));
    return () => ev.forEach((e) => document.removeEventListener(e, onFs));
  }, [quizStarted, quizCompleted]);

  /* Tab blur detection */
  useEffect(() => {
    if (!quizStarted || quizCompleted) return;
    const onBlur = () => handleSubmitQuiz("Tab/window switched");
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", () => { if (document.hidden) onBlur(); });
    return () => window.removeEventListener("blur", onBlur);
  }, [quizStarted, quizCompleted]);

  async function handleStartQuiz() {
    let videoStream: MediaStream | null = null;
    let audioStream: MediaStream | null = null;
    try {
      videoStream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 }, audio: false });
    } catch {}
    try {
      audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch {}

    enterFullscreen(document.documentElement);
    setQuizStarted(true);

    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
      videoRef.current.play().catch(() => {});
      streamRef.current = videoStream;
      startFaceDetection();
    }
    if (audioStream) {
      startAudioMonitoring(audioStream);
    }
  };

  function startFaceDetection() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const detect = async () => {
      if (quizCompletedRef.current) return;
      try {
        const faceDetector = new (window as any).FaceDetector({ fastMode: true, maxDetectedFaces: 5 });
        const faces = await faceDetector.detect(video);
        setFaceCount(faces.length);
        if (faces.length >= 2) {
          triggerCheat("Multiple faces detected by camera");
          return;
        }
      } catch (e) {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = 160;
        canvas.height = 120;
        ctx.drawImage(video, 0, 0, 160, 120);
        const frame = ctx.getImageData(0, 0, 160, 120);
        let skinPixels = 0;
        for (let i = 0; i < frame.data.length; i += 4) {
          const r = frame.data[i];
          const g = frame.data[i + 1];
          const b = frame.data[i + 2];
          if (r > 95 && g > 40 && b > 20 && (Math.max(r, g, b) - Math.min(r, g, b)) > 15 && Math.abs(r - g) > 15 && r > g && r > b) {
            skinPixels++;
          }
        }
        const skinRatio = skinPixels / (160 * 120);
        const estimatedFaces = skinRatio > 0.12 ? 2 : skinRatio > 0.05 ? 1 : 0;
        setFaceCount(estimatedFaces);
        if (estimatedFaces >= 2) {
          triggerCheat("Multiple people detected in camera frame");
          return;
        }
      }
      faceIntervalRef.current = requestAnimationFrame(detect);
    };
    if (video.readyState >= 2) {
      faceIntervalRef.current = requestAnimationFrame(detect);
    } else {
      video.onloadeddata = () => {
        faceIntervalRef.current = requestAnimationFrame(detect);
      };
    }
  };

  function startAudioMonitoring(stream: MediaStream) {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = audioCtx;
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let loudCount = 0;
    audioIntervalRef.current = setInterval(() => {
      if (quizCompletedRef.current) return;
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      const avg = sum / dataArray.length;
      setNoiseLevel(Math.round(avg));
      if (avg > 60) {
        loudCount++;
        if (loudCount >= 3) {
          triggerCheat("Noise / other voices detected by microphone");
          loudCount = 0;
        }
      } else {
        loudCount = 0;
      }
    }, 300);
  };

  function triggerCheat(reason: string) {
    if (quizCompletedRef.current) return;
    setCheatReason(reason);
    handleSubmitQuiz(reason);
  };

  useEffect(() => {
    quizCompletedRef.current = quizCompleted;
  }, [quizCompleted]);

  useEffect(() => {
    return () => {
      if (faceIntervalRef.current) cancelAnimationFrame(faceIntervalRef.current);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < (quiz?.questions?.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  function handleSubmitQuiz(reason?: string) {
    if (quizCompletedRef.current) return;
    quizCompletedRef.current = true;
    setQuizCompleted(true);
    if (reason) setCheatReason(reason);
    let correctAnswers = 0;
    quiz?.questions?.forEach((q: any, index: number) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / (quiz?.questions?.length || 1)) * 100);
    console.log(`Quiz completed! Score: ${score}%`, reason ? `Reason: ${reason}` : "");
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!quiz) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full max-w-7xl px-6 pt-8">
          <PageHeader
            title="Quiz Not Found"
            description="The requested quiz could not be found"
          />
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-gray-600">Please go back to materials and select a valid quiz.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted && !quizCompleted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full max-w-4xl mx-auto px-6 pt-8">
          <PageHeader
            title={quiz.title}
            description={`${quiz.subject} · ${quiz.teacher} · ${quiz.duration} minutes`}
          />
          
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Quiz?</h2>
              <p className="text-gray-600 mb-6">
                This quiz contains {quiz.questions.length} questions and has a time limit of {quiz.duration} minutes.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => navigate({ to: "/student/materials" })}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Materials
                </button>
                <button
                  onClick={handleStartQuiz}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Play className="w-4 h-4" />
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const correctAnswers = quiz.questions.filter((q: any, index: number) => selectedAnswers[index] === q.correctAnswer).length;
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full max-w-4xl mx-auto px-6 pt-8">
          <PageHeader
            title="Quiz Completed"
            description="Your results and performance"
          />
          
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="text-center mb-8">
              <div className="mb-6">
                {score >= 80 ? (
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                ) : score >= 60 ? (
                  <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto" />
                ) : (
                  <AlertCircle className="w-16 h-16 text-red-600 mx-auto" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {score >= 80 ? "Excellent!" : score >= 60 ? "Good Job!" : "Keep Practicing!"}
              </h2>
              {cheatReason && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm font-semibold">
                  ⚠ Quiz auto-submitted: {cheatReason}
                </div>
              )}
              <p className="text-xl text-gray-700 mb-4">
                Your Score: {score}%
              </p>
              <p className="text-gray-600 mb-6">
                You answered {correctAnswers} out of {quiz.questions.length} questions correctly.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setCurrentQuestion(0);
                    setSelectedAnswers([]);
                    setQuizCompleted(false);
                    quizCompletedRef.current = false;
                    setTimeLeft(quiz.duration * 60);
                    setCheatReason(null);
                    setFaceCount(0);
                    setNoiseLevel(0);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Play className="w-4 h-4" />
                  Retake Quiz
                </button>
                <button
                  onClick={() => navigate({ to: "/student/materials" })}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Materials
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-4xl mx-auto px-6 pt-8">
        <video ref={videoRef} style={{ display: "none" }} autoPlay playsInline muted />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Anti-cheat monitoring bar */}
        <div className="mb-4 flex flex-wrap items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">Anti-Cheat Active</span>
          <div className="flex items-center gap-1.5 text-xs text-gray-700">
            <Camera className="w-3 h-3" /> Faces: {faceCount}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-700">
            <Volume2 className="w-3 h-3" /> Noise: {noiseLevel}
          </div>
          <span className="text-xs text-red-600 font-medium ml-auto">Do not switch tabs or exit fullscreen — quiz will auto-submit</span>
        </div>

        {cheatReason && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm font-semibold">
            ⚠ Cheating detected: {cheatReason}. Quiz auto-submitted.
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <PageHeader
            title={quiz.title}
            description={`${quiz.subject} · ${quiz.teacher}`}
          />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{formatTime(timeLeft)}</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQ.question}
            </h3>
            
            <div className="space-y-3">
              {currentQ.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    selectedAnswers[currentQuestion] === index
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedAnswers[currentQuestion] === index
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300 bg-white"
                    }`}>
                      {selectedAnswers[currentQuestion] === index && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            
            <button
              onClick={currentQuestion === quiz.questions.length - 1 ? () => handleSubmitQuiz() : handleNextQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {currentQuestion === quiz.questions.length - 1 ? "Submit Quiz" : "Next"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
