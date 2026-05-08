import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/discipline-master/deduct-marks/test')({
  component: TestPage,
});

function TestPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Test Page</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">This is a test page to verify routing works.</p>
        <button 
          onClick={() => window.history.back()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
