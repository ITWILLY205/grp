import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/discipline-master/cases')({
  component: CaseManagement,
});

function CaseManagement() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Case Management</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Case management content will be displayed here.</p>
      </div>
    </div>
  );
}
