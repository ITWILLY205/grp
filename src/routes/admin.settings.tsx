import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Building2, GraduationCap, Shield, Bell, Clock, AlertTriangle, FileText, Settings, Database, Ban, Check } from "lucide-react";
import { loadSettings, saveSettings, type AppSettings } from "@/lib/settingsStore";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

type SettingsTab = "school" | "academic" | "roles" | "notifications" | "timetable" | "discipline" | "reports" | "system" | "data";

// Reusable save success toast
function SaveToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg animate-pulse">
      <Check className="h-5 w-5" />
      <span className="font-medium text-sm">Settings saved & applied!</span>
    </div>
  );
}

function AdminSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("school");
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [showToast, setShowToast] = useState(false);

  const handleSave = useCallback((updated: AppSettings) => {
    saveSettings(updated);
    setSettings(updated);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }, []);

  const tabs = [
    { id: "school" as SettingsTab, label: "School Info", icon: Building2 },
    { id: "academic" as SettingsTab, label: "Academics", icon: GraduationCap },
    { id: "roles" as SettingsTab, label: "Users & Roles", icon: Shield },
    { id: "notifications" as SettingsTab, label: "Notifications", icon: Bell },
    { id: "timetable" as SettingsTab, label: "Timetable", icon: Clock },
    { id: "discipline" as SettingsTab, label: "Discipline", icon: AlertTriangle },
    { id: "reports" as SettingsTab, label: "Reports", icon: FileText },
    { id: "system" as SettingsTab, label: "System", icon: Settings },
    { id: "data" as SettingsTab, label: "Data Management", icon: Database },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-5xl mx-auto px-6 pt-8 pb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        {/* Tab Navigation */}
        <div className="space-y-2 mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.slice(0, 5).map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className="flex border-b border-gray-200">
            {tabs.slice(5).map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "school" && <SchoolInfo settings={settings} onSave={handleSave} />}
        {activeTab === "academic" && <AcademicSettings settings={settings} onSave={handleSave} />}
        {activeTab === "roles" && <UserRoles settings={settings} onSave={handleSave} />}
        {activeTab === "notifications" && <NotificationSettings settings={settings} onSave={handleSave} />}
        {activeTab === "timetable" && <TimetableSettings settings={settings} onSave={handleSave} />}
        {activeTab === "discipline" && <DisciplineSettings settings={settings} onSave={handleSave} />}
        {activeTab === "reports" && <ReportSettings settings={settings} onSave={handleSave} />}
        {activeTab === "system" && <SystemSettings settings={settings} onSave={handleSave} />}
        {activeTab === "data" && <DataManagement />}
      </div>
      <SaveToast show={showToast} />
    </div>
  );
}

interface TabProps {
  settings: AppSettings;
  onSave: (s: AppSettings) => void;
}

// ─── School Information ──────────────────────────────────────────────
function SchoolInfo({ settings, onSave }: TabProps) {
  const [formData, setFormData] = useState(settings.school);

  useEffect(() => { setFormData(settings.school); }, [settings.school]);

  const handleSave = () => {
    onSave({ ...settings, school: formData });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">School Information</h3>
        <p className="text-sm text-blue-700">Define your institution's identity. Used in reports, timetables, and certificates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">School Name *</label>
          <input type="text" value={formData.schoolName} onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })} placeholder="Enter school name" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo Upload</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Enter school address" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Enter phone number" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Enter school email" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">School Code</label>
          <input type="text" value={formData.schoolCode} onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value })} placeholder="Enter school code (optional)" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Motto / Slogan</label>
          <input type="text" value={formData.motto} onChange={(e) => setFormData({ ...formData, motto: e.target.value })} placeholder="Enter school motto" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button onClick={() => setFormData(settings.school)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
        <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
      </div>
    </div>
  );
}

// ─── Academic Settings ──────────────────────────────────────────────
function AcademicSettings({ settings, onSave }: TabProps) {
  const [formData, setFormData] = useState(settings.academic);

  useEffect(() => { setFormData(settings.academic); }, [settings.academic]);

  const handleSave = () => {
    onSave({ ...settings, academic: formData });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Academic Settings</h3>
        <p className="text-sm text-blue-700">Control how academics behave. Changes affect all academic modules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year Format</label>
          <input type="text" value={formData.academicYear} onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })} placeholder="e.g., 2025–2026" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Term Structure</label>
          <select value={formData.termStructure} onChange={(e) => setFormData({ ...formData, termStructure: e.target.value })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="2">2 Terms</option>
            <option value="3">3 Terms</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Default Grading System</label>
          <select value={formData.gradingSystem} onChange={(e) => setFormData({ ...formData, gradingSystem: e.target.value })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="standard">Standard (A = 80–100, B = 70–79)</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pass Mark Threshold (%)</label>
          <input type="number" value={formData.passMark} onChange={(e) => setFormData({ ...formData, passMark: e.target.value })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CAT Weight (%)</label>
          <input type="number" value={formData.catWeight} onChange={(e) => setFormData({ ...formData, catWeight: e.target.value })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Exam Weight (%)</label>
          <input type="number" value={formData.examWeight} onChange={(e) => setFormData({ ...formData, examWeight: e.target.value })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">Grading Scale Preview</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div className="bg-white p-2 rounded border border-yellow-300"><span className="font-medium">A</span> = 80–100</div>
          <div className="bg-white p-2 rounded border border-yellow-300"><span className="font-medium">B</span> = 70–79</div>
          <div className="bg-white p-2 rounded border border-yellow-300"><span className="font-medium">C</span> = 60–69</div>
          <div className="bg-white p-2 rounded border border-yellow-300"><span className="font-medium">D</span> = 50–59</div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button onClick={() => setFormData(settings.academic)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
        <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
      </div>
    </div>
  );
}

// ─── User Roles & Permissions ───────────────────────────────────────
function UserRoles({ settings, onSave }: TabProps) {
  const [selectedUserToBlock, setSelectedUserToBlock] = useState("");
  const [blockedUsers, setBlockedUsers] = useState<string[]>(settings.blockedUsers);
  const [selectedRoleToBlock, setSelectedRoleToBlock] = useState("");
  const [blockedRoles, setBlockedRoles] = useState<string[]>(settings.blockedRoles);

  useEffect(() => {
    setBlockedUsers(settings.blockedUsers);
    setBlockedRoles(settings.blockedRoles);
  }, [settings.blockedUsers, settings.blockedRoles]);

  const users = [
    { id: 1, name: "John Doe", email: "john@school.edu", role: "Teacher" },
    { id: 2, name: "Jane Smith", email: "jane@school.edu", role: "Student" },
    { id: 3, name: "Mike Johnson", email: "mike@school.edu", role: "Admin" },
    { id: 4, name: "Sarah Williams", email: "sarah@school.edu", role: "Parent" },
  ];

  const roles = [
    { name: "Admin", permissions: ["All permissions"], color: "red" },
    { name: "Teacher", permissions: ["Edit marks", "View reports", "Manage attendance"], color: "blue" },
    { name: "Clerk", permissions: ["View reports", "Manage students"], color: "green" },
    { name: "Student", permissions: ["View own marks", "View own reports"], color: "gray" },
  ];

  const roleOptions = [
    { value: "Teacher", label: "Teachers" },
    { value: "Student", label: "Students" },
    { value: "Parent", label: "Parents" },
    { value: "Clerk", label: "Clerks" },
  ];

  const handleBlockUser = () => {
    if (selectedUserToBlock && !blockedUsers.includes(selectedUserToBlock)) {
      const updated = [...blockedUsers, selectedUserToBlock];
      setBlockedUsers(updated);
      setSelectedUserToBlock("");
      onSave({ ...settings, blockedUsers: updated, blockedRoles });
    }
  };

  const handleUnblockUser = (userName: string) => {
    const updated = blockedUsers.filter((user) => user !== userName);
    setBlockedUsers(updated);
    onSave({ ...settings, blockedUsers: updated, blockedRoles });
  };

  const handleBlockRole = () => {
    if (selectedRoleToBlock && !blockedRoles.includes(selectedRoleToBlock)) {
      const updated = [...blockedRoles, selectedRoleToBlock];
      setBlockedRoles(updated);
      setSelectedRoleToBlock("");
      onSave({ ...settings, blockedUsers, blockedRoles: updated });
    }
  };

  const handleUnblockRole = (role: string) => {
    const updated = blockedRoles.filter((r) => r !== role);
    setBlockedRoles(updated);
    onSave({ ...settings, blockedUsers, blockedRoles: updated });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">User Roles & Permissions</h3>
        <p className="text-sm text-blue-700">Role-based access control (RBAC). System checks permissions before actions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div key={role.name} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">{role.name}</h4>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
            </div>
            <div className="space-y-2">
              {role.permissions.map((permission) => (
                <div key={permission} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className={`w-2 h-2 rounded-full bg-${role.color}-500`} />
                  {permission}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Block User Section */}
      <div className="bg-white border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Ban className="h-5 w-5 text-red-600" />
          <h4 className="font-semibold text-gray-900">Block User Access</h4>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select User to Block</label>
            <select value={selectedUserToBlock} onChange={(e) => setSelectedUserToBlock(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              <option value="">Choose a user...</option>
              {users.filter((user) => !blockedUsers.includes(user.name)).map((user) => (
                <option key={user.id} value={user.name}>{user.name} - {user.role}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            <p className="mb-2">• Blocked users cannot access the system</p>
            <p>• All active sessions will be terminated</p>
          </div>
          <button onClick={handleBlockUser} disabled={!selectedUserToBlock} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm">Block User</button>
          {blockedUsers.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-sm font-medium text-red-900 mb-3">Currently Blocked Users:</p>
              <div className="space-y-2">
                {blockedUsers.map((blockedUser) => (
                  <div key={blockedUser} className="flex items-center justify-between bg-white p-3 rounded-lg border border-red-200">
                    <span className="text-sm text-red-700">{blockedUser}</span>
                    <button onClick={() => handleUnblockUser(blockedUser)} className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">Unblock</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Block Role Section */}
      <div className="bg-white border border-orange-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-orange-600" />
          <h4 className="font-semibold text-gray-900">Block All Users by Role</h4>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Role to Block</label>
            <select value={selectedRoleToBlock} onChange={(e) => setSelectedRoleToBlock(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              <option value="">Choose a role...</option>
              {roleOptions.filter((role) => !blockedRoles.includes(role.value)).map((role) => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            <p className="mb-2">• All users with this role will lose system access</p>
            <p>• This revokes all permissions for the selected role</p>
          </div>
          <button onClick={handleBlockRole} disabled={!selectedRoleToBlock} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm">Block All Users in Role</button>
          {blockedRoles.length > 0 && (
            <div className="mt-4 p-4 bg-orange-50 rounded-lg">
              <p className="text-sm font-medium text-orange-900 mb-3">Currently Blocked Roles:</p>
              <div className="space-y-2">
                {blockedRoles.map((blockedRole) => (
                  <div key={blockedRole} className="flex items-center justify-between bg-white p-3 rounded-lg border border-orange-200">
                    <span className="text-sm text-orange-700">All {blockedRole}s</span>
                    <button onClick={() => handleUnblockRole(blockedRole)} className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">Unblock Role</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add New Role</button>
      </div>
    </div>
  );
}

// ─── Notification Settings ──────────────────────────────────────────
function NotificationSettings({ settings, onSave }: TabProps) {
  const [emailEnabled, setEmailEnabled] = useState(settings.notifications.emailEnabled);
  const [smsEnabled, setSmsEnabled] = useState(settings.notifications.smsEnabled);
  const [triggers, setTriggers] = useState(settings.notifications.triggers);

  useEffect(() => {
    setEmailEnabled(settings.notifications.emailEnabled);
    setSmsEnabled(settings.notifications.smsEnabled);
    setTriggers(settings.notifications.triggers);
  }, [settings.notifications]);

  const handleSave = () => {
    onSave({ ...settings, notifications: { emailEnabled, smsEnabled, triggers } });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Notification Settings</h3>
        <p className="text-sm text-blue-700">Control communication. System sends alerts based on triggers.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Notification Channels</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <button onClick={() => setEmailEnabled(!emailEnabled)} className={`w-12 h-6 rounded-full transition-colors ${emailEnabled ? "bg-blue-600" : "bg-gray-300"}`}>
                <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${emailEnabled ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-600">Receive notifications via SMS</p>
              </div>
              <button onClick={() => setSmsEnabled(!smsEnabled)} className={`w-12 h-6 rounded-full transition-colors ${smsEnabled ? "bg-blue-600" : "bg-gray-300"}`}>
                <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${smsEnabled ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Event Triggers</h4>
          <div className="space-y-4">
            {[
              { key: "newReport", label: "New report generated" },
              { key: "discipline", label: "Discipline incident recorded" },
              { key: "feeReminder", label: "Fee reminders" },
            ].map((trigger) => (
              <div key={trigger.key} className="flex items-center justify-between">
                <p className="text-gray-900">{trigger.label}</p>
                <button
                  onClick={() => setTriggers({ ...triggers, [trigger.key]: !triggers[trigger.key as keyof typeof triggers] })}
                  className={`w-12 h-6 rounded-full transition-colors ${triggers[trigger.key as keyof typeof triggers] ? "bg-blue-600" : "bg-gray-300"}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${triggers[trigger.key as keyof typeof triggers] ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
      </div>
    </div>
  );
}

// ─── Timetable Settings ─────────────────────────────────────────────
function TimetableSettings({ settings, onSave }: TabProps) {
  const [formData, setFormData] = useState(settings.timetable);

  useEffect(() => { setFormData(settings.timetable); }, [settings.timetable]);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleSave = () => {
    onSave({ ...settings, timetable: formData });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Timetable Settings</h3>
        <p className="text-sm text-blue-700">Controls scheduling rules. Used when generating timetable grid.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Periods Per Day</label>
          <input type="number" value={formData.periodsPerDay} onChange={(e) => setFormData({ ...formData, periodsPerDay: e.target.value })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Period Duration (minutes)</label>
          <input type="number" value={formData.periodDuration} onChange={(e) => setFormData({ ...formData, periodDuration: e.target.value })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Break Time</label>
          <input type="time" value={formData.breakTime} onChange={(e) => setFormData({ ...formData, breakTime: e.target.value })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Break Duration (minutes)</label>
          <input type="number" value={formData.breakDuration} onChange={(e) => setFormData({ ...formData, breakDuration: e.target.value })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Working Days</h4>
        <div className="flex flex-wrap gap-3">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => {
                const newDays = formData.workingDays.includes(day) ? formData.workingDays.filter((d) => d !== day) : [...formData.workingDays, day];
                setFormData({ ...formData, workingDays: newDays });
              }}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                formData.workingDays.includes(day) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-600"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
      </div>
    </div>
  );
}

// ─── Discipline Settings ────────────────────────────────────────────
function DisciplineSettings({ settings, onSave }: TabProps) {
  const [formData, setFormData] = useState(settings.discipline);

  useEffect(() => { setFormData(settings.discipline); }, [settings.discipline]);

  const handleSave = () => {
    onSave({ ...settings, discipline: formData });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Discipline Settings</h3>
        <p className="text-sm text-blue-700">Controls behavior system rules. Automatically applied when incidents are recorded.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Warning Threshold (offenses)</label>
          <input type="number" value={formData.warningThreshold} onChange={(e) => setFormData({ ...formData, warningThreshold: e.target.value })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
          <p className="text-xs text-gray-500 mt-1">Auto-warning after N offenses</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Suspension Threshold (offenses)</label>
          <input type="number" value={formData.suspensionThreshold} onChange={(e) => setFormData({ ...formData, suspensionThreshold: e.target.value })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
          <p className="text-xs text-gray-500 mt-1">Auto-suspend after N offenses</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">Behavior Scoring System</h4>
            <p className="text-sm text-gray-600">Enable behavior scoring for students</p>
          </div>
          <button onClick={() => setFormData({ ...formData, behaviorScoring: !formData.behaviorScoring })} className={`w-12 h-6 rounded-full transition-colors ${formData.behaviorScoring ? "bg-blue-600" : "bg-gray-300"}`}>
            <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${formData.behaviorScoring ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Offense Categories</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {["Late Coming", "Absenteeism", "Fighting", "Disrespect", "Cheating", "Uniform Violation"].map((offense) => (
            <div key={offense} className="border border-gray-200 rounded-lg p-3 text-sm">{offense}</div>
          ))}
        </div>
        <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">+ Add Category</button>
      </div>

      <div className="flex justify-end gap-4">
        <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
      </div>
    </div>
  );
}

// ─── Report Settings ────────────────────────────────────────────────
function ReportSettings({ settings, onSave }: TabProps) {
  const [formData, setFormData] = useState(settings.reports);

  useEffect(() => { setFormData(settings.reports); }, [settings.reports]);

  const handleSave = () => {
    onSave({ ...settings, reports: formData });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Report Settings</h3>
        <p className="text-sm text-blue-700">Controls output formatting. Applied when generating reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Report Template Style</label>
          <select value={formData.templateStyle} onChange={(e) => setFormData({ ...formData, templateStyle: e.target.value })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option>Classic</option>
            <option>Modern</option>
            <option>Minimal</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo Placement</label>
          <select value={formData.logoPlacement} onChange={(e) => setFormData({ ...formData, logoPlacement: e.target.value })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option>Top Left</option>
            <option>Top Center</option>
            <option>Top Right</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Show/Hide Sections</h4>
        <div className="space-y-3">
          {[
            { key: "attendance", label: "Attendance" },
            { key: "discipline", label: "Discipline" },
            { key: "rankings", label: "Rankings" },
          ].map((section) => (
            <div key={section.key} className="flex items-center justify-between">
              <p className="text-gray-900">{section.label}</p>
              <button
                onClick={() => setFormData({ ...formData, sections: { ...formData.sections, [section.key]: !formData.sections[section.key as keyof typeof formData.sections] } })}
                className={`w-12 h-6 rounded-full transition-colors ${formData.sections[section.key as keyof typeof formData.sections] ? "bg-blue-600" : "bg-gray-300"}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${formData.sections[section.key as keyof typeof formData.sections] ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
      </div>
    </div>
  );
}

// ─── System Settings ────────────────────────────────────────────────
function SystemSettings({ settings, onSave }: TabProps) {
  const [formData, setFormData] = useState(settings.system);

  useEffect(() => { setFormData(settings.system); }, [settings.system]);

  const handleSave = () => {
    onSave({ ...settings, system: formData });
  };

  const toggleSystem = () => {
    const updated = { ...formData, systemClosed: !formData.systemClosed };
    setFormData(updated);
    // Save immediately on toggle so it takes effect right away
    onSave({ ...settings, system: updated });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">System Settings</h3>
        <p className="text-sm text-blue-700">Technical controls for the application.</p>
      </div>

      {/* ── System Access Control ── */}
      <div className={`rounded-xl border-2 p-6 transition-colors ${formData.systemClosed ? "border-red-400 bg-red-50" : "border-green-400 bg-green-50"}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className={`text-lg font-bold ${formData.systemClosed ? "text-red-800" : "text-green-800"}`}>
              System Access
            </h4>
            <p className={`text-sm mt-1 ${formData.systemClosed ? "text-red-600" : "text-green-600"}`}>
              {formData.systemClosed
                ? "⛔ System is CLOSED — Only admins can log in"
                : "✅ System is OPEN — All users can access the platform"}
            </p>
          </div>
          {/* Big toggle */}
          <button
            onClick={toggleSystem}
            className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors focus:outline-none shadow-inner ${
              formData.systemClosed ? "bg-red-500" : "bg-green-500"
            }`}
          >
            <span
              className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-md transition-transform ${
                formData.systemClosed ? "translate-x-11" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {formData.systemClosed && (
          <div className="mt-4 space-y-3">
            <label className="block text-sm font-medium text-red-800">
              Maintenance Message (shown to blocked users)
            </label>
            <textarea
              value={formData.maintenanceMessage}
              onChange={(e) => setFormData({ ...formData, maintenanceMessage: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Enter a message to display to users during maintenance..."
            />
            <p className="text-xs text-red-500">
              💡 This message will be displayed on the maintenance page that all non-admin users see.
            </p>
          </div>
        )}

        {!formData.systemClosed && (
          <div className="mt-3 p-3 bg-green-100 rounded-lg border border-green-200">
            <p className="text-xs text-green-700">
              When you close the system, students and parents will be redirected to a maintenance page.
              Teachers will also be locked out. Only admins can bypass the lockdown via the Staff Login.
            </p>
          </div>
        )}
      </div>

      {/* ── Other System Settings ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
          <select value={formData.theme} onChange={(e) => setFormData({ ...formData, theme: e.target.value })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option>Light</option>
            <option>Dark</option>
            <option>System Default</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option>English</option>
            <option>French</option>
            <option>Spanish</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select value={formData.timezone} onChange={(e) => setFormData({ ...formData, timezone: e.target.value })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option>UTC+0</option>
            <option>UTC+2</option>
            <option>UTC+3</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
          <input type="number" value={formData.sessionTimeout} onChange={(e) => setFormData({ ...formData, sessionTimeout: e.target.value })} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
      </div>
    </div>
  );
}

// ─── Data Management ────────────────────────────────────────────────
function DataManagement() {
  const handleBackup = () => {
    const allData = {
      settings: localStorage.getItem("scholar_sphere_settings"),
      auditLogs: localStorage.getItem("scholar_sphere_audit_logs"),
      smsLogs: localStorage.getItem("scholar_sphere_sms_logs"),
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scholar_sphere_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert("Backup downloaded successfully!");
  };

  const handleRestore = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const data = JSON.parse(ev.target?.result as string);
            if (data.settings) localStorage.setItem("scholar_sphere_settings", data.settings);
            if (data.auditLogs) localStorage.setItem("scholar_sphere_audit_logs", data.auditLogs);
            if (data.smsLogs) localStorage.setItem("scholar_sphere_sms_logs", data.smsLogs);
            alert("Backup restored successfully! Please refresh the page.");
            window.location.reload();
          } catch {
            alert("Invalid backup file. Please select a valid JSON file.");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearLogs = () => {
    if (confirm("Are you sure you want to clear all audit logs?")) {
      localStorage.removeItem("scholar_sphere_audit_logs");
      localStorage.removeItem("scholar_sphere_sms_logs");
      alert("Logs cleared successfully!");
    }
  };

  const handleArchive = () => {
    handleBackup();
    alert("Academic year data has been archived and downloaded.");
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Data Management</h3>
        <p className="text-sm text-blue-700">Advanced data operations. Use with caution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-2">Backup Database</h4>
          <p className="text-sm text-gray-600 mb-4">Create a full backup of the system database</p>
          <button onClick={handleBackup} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Backup Now</button>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-2">Restore Backup</h4>
          <p className="text-sm text-gray-600 mb-4">Restore from a previous backup</p>
          <button onClick={handleRestore} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">Restore</button>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-2">Clear Old Logs</h4>
          <p className="text-sm text-gray-600 mb-4">Remove audit logs older than 30 days</p>
          <button onClick={handleClearLogs} className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm">Clear Logs</button>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-2">Archive Academic Year</h4>
          <p className="text-sm text-gray-600 mb-4">Archive completed academic year data</p>
          <button onClick={handleArchive} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">Archive</button>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
