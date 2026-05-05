import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader, DataTable, Badge } from "@/components/dashboard/SharedUI";
import { Plus, Search, Filter, MoreHorizontal, Edit2, Trash2, X, User, Mail, Shield, Users, BookOpen, Calendar, Award, Phone } from "lucide-react";
import { useState } from "react";
import { AdminStudents } from "./admin.students";
import { AdminTeachers } from "./admin.teachers";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

type UserRole = "student" | "teacher" | "parent" | "admin";

const mockUsers: User[] = [];
const studentsData: any[] = [];

interface Student {
  id: number;
  indexNumber: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  gender: string;
  age: number;
  attendance: string;
  average: string;
  status: string;
}

const classes = [
  "Select Class",
  "Form 1",
  "Form 2", 
  "Form 3",
  "Form 4",
  "Form 5",
  "Form 6"
];

const roleColors: Record<UserRole, "default" | "success" | "warning" | "danger"> = {
  student: "default",
  teacher: "success",
  parent: "warning",
  admin: "danger",
};

interface User {
  id: number;
  indexNumber: string;
  name: string;
  email: string;
  role: UserRole;
  class: string;
  department?: string;
  status: "active" | "inactive";
  linkedStudent?: string;
}

function AdminUsers() {
  const navigate = useNavigate();
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Student management state
  const [students, setStudents] = useState<Student[]>(studentsData);
  const [selectedClass, setSelectedClass] = useState("Select Class");
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Parent management state
  const [parentNameSearch, setParentNameSearch] = useState("");
  const [studentNameSearch, setStudentNameSearch] = useState("");
  
  const [formData, setFormData] = useState({
    indexNumber: "",
    name: "",
    email: "",
    role: "student" as UserRole,
    class: "",
    status: "active" as "active" | "inactive"
  });

  const [studentFormData, setStudentFormData] = useState({
    indexNumber: "",
    name: "",
    email: "",
    phone: "",
    class: "",
    gender: "Male",
    age: "",
    attendance: "",
    average: "",
    status: "active" as "active" | "inactive"
  });

  // Show student management if student role is selected
  if (roleFilter === ("student" as UserRole)) {
    return <AdminStudents />;
  }

  // Show teacher management if teacher role is selected
  if (roleFilter === ("teacher" as UserRole)) {
    return <AdminTeachers />;
  }

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchDepartment = departmentFilter === "all" || u.department === departmentFilter;
    
    // Parent-specific filtering
    let matchParentFilters = true;
    if (roleFilter === "parent") {
      const matchParentName = parentNameSearch === "" || u.name.toLowerCase().includes(parentNameSearch.toLowerCase());
      const matchStudentName = studentNameSearch === "" || (u.linkedStudent !== undefined && u.linkedStudent.toLowerCase().includes(studentNameSearch.toLowerCase()));
      matchParentFilters = matchParentName && matchStudentName;
    }
    
    return matchSearch && matchRole && matchDepartment && matchParentFilters;
  });

  const handleCreateUser = () => {
    if (formData.indexNumber && formData.name && formData.email) {
      const newUser: User = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...formData,
        status: formData.status as "active" | "inactive"
      };
      setUsers([...users, newUser]);
      setFormData({
        indexNumber: "",
        name: "",
        email: "",
        role: "student",
        class: "",
        status: "active"
      });
      setShowCreateModal(false);
      alert("User created successfully!");
    }
  };

  const handleUpdateUser = () => {
    if (selectedUser && formData.name && formData.email) {
      setUsers(users.map(u => 
        u.id === selectedUser.id 
          ? { ...u, ...formData }
          : u
      ));
      setShowEditModal(false);
      setSelectedUser(null);
      setFormData({
        indexNumber: "",
        name: "",
        email: "",
        role: "student",
        class: "",
        status: "active"
      });
      alert("User updated successfully!");
    }
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== userId));
      alert("User deleted successfully!");
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      indexNumber: user.indexNumber,
      name: user.name,
      email: user.email,
      role: user.role,
      class: user.class,
      status: user.status as "active" | "inactive"
    });
    setShowEditModal(true);
  };

  const generateIndexNumber = (role: UserRole) => {
    const prefix = role.toUpperCase().substring(0, 3);
    const existingUsers = users.filter(u => u.role === role);
    const nextNumber = (existingUsers.length + 1).toString().padStart(3, '0');
    return `${prefix}${nextNumber}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-6xl px-6 pt-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          {roleFilter === "teacher" && (
            <button 
              onClick={() => navigate({ to: "/admin/add-teacher" })}
              className="flex items-center gap-2 rounded-xl bg-hero-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:glow-primary cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 z-10 relative"
              type="button"
            >
              <Plus className="h-4 w-4" />
              Add New Teacher
            </button>
          )}
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter name..."
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          {roleFilter !== "teacher" && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Role
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as UserRole | "all")}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          {roleFilter === ("teacher" as UserRole) ? (
            <>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Department
                </label>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Departments</option>
                  <option value="Science">Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                </select>
              </div>
            </>
          ) : roleFilter === ("parent" as UserRole) ? (
            <>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Parent Name
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={parentNameSearch}
                    onChange={(e) => setParentNameSearch(e.target.value)}
                    placeholder="Enter parent name..."
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Student Name
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={studentNameSearch}
                    onChange={(e) => setStudentNameSearch(e.target.value)}
                    placeholder="Enter student name..."
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Search
                </button>
              </div>
            </>
          ) : null}
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
                      Username
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
};

export default AdminUsers;
