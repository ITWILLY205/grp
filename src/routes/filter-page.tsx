import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Users, Filter } from "lucide-react";

export const Route = createFileRoute("/filter-page")({
  component: FilterPage,
});

interface User {
  id: number;
  indexNumber: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "parent" | "admin";
  class: string;
  department?: string;
  status: string;
}

const mockUsers = [
  { id: 1, indexNumber: "STU001", name: "Sarah Johnson", email: "sarah@school.com", role: "student" as const, class: "Form 1", status: "active" },
  { id: 2, indexNumber: "TCH001", name: "David Park", email: "dpark@school.com", role: "teacher" as const, class: "Form 3", status: "active" },
  { id: 3, indexNumber: "STU002", name: "Emily Chen", email: "echen@school.com", role: "student" as const, class: "Form 2", status: "active" },
  { id: 4, indexNumber: "PAR001", name: "Robert Wilson", email: "rwilson@school.com", role: "parent" as const, class: "—", status: "active" },
  { id: 5, indexNumber: "TCH002", name: "Maria Garcia", email: "mgarcia@school.com", role: "teacher" as const, class: "Form 1", status: "active" },
  { id: 6, indexNumber: "STU003", name: "Ahmed Hassan", email: "ahassan@school.com", role: "student" as const, class: "Form 4", status: "inactive" },
  { id: 7, indexNumber: "ADM001", name: "Lisa Thompson", email: "lthompson@school.com", role: "admin" as const, class: "—", status: "active" },
  { id: 8, indexNumber: "STU004", name: "James Lee", email: "jlee@school.com", role: "student" as const, class: "Form 2", status: "active" },
];

function FilterPage() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [users, setUsers] = useState<User[]>(mockUsers);

  const classes = ["Form 1", "Form 2", "Form 3", "Form 4", "Form 5", "Form 6"];

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.indexNumber.toLowerCase().includes(search.toLowerCase());
    const matchClass = classFilter === "all" || u.class === classFilter;
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchClass && matchRole && matchStatus;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-6xl px-6 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Filter Users</h2>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by Name
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, ID..."
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Class
            </label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Classes</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="mt-8">
          {filtered.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Index Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {user.indexNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin" ? "bg-red-100 text-red-800" :
                          user.role === "teacher" ? "bg-blue-100 text-blue-800" :
                          user.role === "parent" ? "bg-green-100 text-green-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {user.class}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-8 w-8 text-gray-400" />
                <p className="text-gray-600">No users found</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
