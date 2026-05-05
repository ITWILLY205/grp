// Audit Log System for Scholar Sphere
// Tracks high-impact actions across the application

// Log Action Types
export type LogAction = 
  | "LOGIN" 
  | "LOGOUT" 
  | "FAILED_LOGIN" 
  | "PASSWORD_CHANGE" 
  | "PASSWORD_RESET"
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "DEACTIVATE"
  | "ASSIGN"
  | "PROMOTE"
  | "GRADE"
  | "GENERATE"
  | "EXPORT"
  | "IMPORT"
  | "OVERRIDE";

// Module Types
export type LogModule = 
  | "AUTHENTICATION"
  | "STUDENTS"
  | "ACADEMICS"
  | "DISCIPLINE"
  | "TIMETABLE"
  | "REPORTS"
  | "USERS"
  | "TEACHERS"
  | "CLASSES";

// Log Status
export type LogStatus = "SUCCESS" | "FAILED";

// User Role
export type UserRole = "admin" | "teacher" | "parent" | "student";

// Log Entry Interface
export interface AuditLog {
  id: string;
  user: string;
  userId?: string;
  role: UserRole;
  action: LogAction;
  module: LogModule;
  target: string;
  targetId?: string;
  timestamp: string;
  ipAddress?: string;
  status: LogStatus;
  details?: Record<string, any>;
}

// Log Details for specific actions
export interface StudentLogDetails {
  studentName: string;
  studentId: string;
  changes?: {
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
  };
}

export interface AcademicLogDetails {
  studentName: string;
  subject: string;
  marks?: number;
  oldMarks?: number;
  maxScore?: number;
  term?: string;
  year?: string;
  type?: string;
}

export interface DisciplineLogDetails {
  studentName: string;
  studentId: string;
  incidentType: string;
  severity: string;
  actionTaken: string;
  marksDeducted?: number;
  oldDisciplineMarks?: number;
  newDisciplineMarks?: number;
}

export interface AuthLogDetails {
  loginMethod?: string;
  failureReason?: string;
  ipAddress?: string;
}

// Generate unique log ID
function generateLogId(): string {
  return `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Get current timestamp in ISO format
function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

// Get IP address (simulated - in production, this would come from the server)
function getIPAddress(): string | undefined {
  // In a real application, this would come from the request context
  // For client-side logging, we can use a placeholder or omit it
  return undefined;
}

// Storage key for logs
const LOGS_STORAGE_KEY = "scholar_sphere_audit_logs";
const MAX_LOGS = 1000; // Keep only the last 1000 logs to prevent storage overflow

// Get all logs from storage
export function getLogs(): AuditLog[] {
  try {
    const logs = localStorage.getItem(LOGS_STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error("Error reading logs from storage:", error);
    return [];
  }
}

// Save logs to storage
function saveLogs(logs: AuditLog[]): void {
  try {
    // Keep only the most recent logs
    const trimmedLogs = logs.slice(-MAX_LOGS);
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(trimmedLogs));
  } catch (error) {
    console.error("Error saving logs to storage:", error);
  }
}

// Add a log entry
export function addLog(log: Omit<AuditLog, "id" | "timestamp">): AuditLog {
  const newLog: AuditLog = {
    id: generateLogId(),
    timestamp: getCurrentTimestamp(),
    ...log,
  };

  const logs = getLogs();
  logs.push(newLog);
  saveLogs(logs);

  return newLog;
}

// Authentication Logs
export function logLogin(user: string, userId: string, role: UserRole, details?: AuthLogDetails): AuditLog {
  return addLog({
    user,
    userId,
    role,
    action: "LOGIN",
    module: "AUTHENTICATION",
    target: "User Session",
    ipAddress: getIPAddress(),
    status: "SUCCESS",
    details: {
      loginMethod: details?.loginMethod || "standard",
      ...details,
    },
  });
}

export function logLogout(user: string, userId: string, role: UserRole): AuditLog {
  return addLog({
    user,
    userId,
    role,
    action: "LOGOUT",
    module: "AUTHENTICATION",
    target: "User Session",
    ipAddress: getIPAddress(),
    status: "SUCCESS",
  });
}

export function logFailedLogin(user: string, reason: string): AuditLog {
  return addLog({
    user,
    role: "student", // Default, can be overridden
    action: "FAILED_LOGIN",
    module: "AUTHENTICATION",
    target: "User Session",
    ipAddress: getIPAddress(),
    status: "FAILED",
    details: {
      failureReason: reason,
    },
  });
}

export function logPasswordChange(user: string, userId: string, role: UserRole): AuditLog {
  return addLog({
    user,
    userId,
    role,
    action: "PASSWORD_CHANGE",
    module: "AUTHENTICATION",
    target: "User Password",
    ipAddress: getIPAddress(),
    status: "SUCCESS",
  });
}

// Student Management Logs
export function logCreateStudent(
  user: string,
  role: UserRole,
  studentName: string,
  studentId: string,
  details?: StudentLogDetails
): AuditLog {
  return addLog({
    user,
    role,
    action: "CREATE",
    module: "STUDENTS",
    target: `Student: ${studentName}`,
    targetId: studentId,
    ipAddress: getIPAddress(),
    status: "SUCCESS",
    details: {
      studentName,
      studentId,
      ...details,
    },
  });
}

export function logUpdateStudent(
  user: string,
  role: UserRole,
  studentName: string,
  studentId: string,
  oldValues: Record<string, any>,
  newValues: Record<string, any>
): AuditLog {
  return addLog({
    user,
    role,
    action: "UPDATE",
    module: "STUDENTS",
    target: `Student: ${studentName}`,
    targetId: studentId,
    ipAddress: getIPAddress(),
    status: "SUCCESS",
    details: {
      studentName,
      studentId,
      changes: {
        oldValues,
        newValues,
      },
    },
  });
}

export function logDeleteStudent(
  user: string,
  role: UserRole,
  studentName: string,
  studentId: string
): AuditLog {
  return addLog({
    user,
    role,
    action: "DELETE",
    module: "STUDENTS",
    target: `Student: ${studentName}`,
    targetId: studentId,
    ipAddress: getIPAddress(),
    status: "SUCCESS",
    details: {
      studentName,
      studentId,
    },
  });
}

export function logAssignClass(
  user: string,
  role: UserRole,
  studentName: string,
  studentId: string,
  oldClass: string,
  newClass: string
): AuditLog {
  return addLog({
    user,
    role,
    action: "ASSIGN",
    module: "STUDENTS",
    target: `Student: ${studentName}`,
    targetId: studentId,
    ipAddress: getIPAddress(),
    status: "SUCCESS",
    details: {
      studentName,
      studentId,
      changes: {
        oldClass,
        newClass,
      },
    },
  });
}

export function logPromoteStudent(
  user: string,
  role: UserRole,
  studentName: string,
  studentId: string,
  fromClass: string,
  toClass: string
): AuditLog {
  return addLog({
    user,
    role,
    action: "PROMOTE",
    module: "STUDENTS",
    target: `Student: ${studentName}`,
    targetId: studentId,
    ipAddress: getIPAddress(),
    status: "SUCCESS",
    details: {
      studentName,
      studentId,
      changes: {
        fromClass,
        toClass,
      },
    },
  });
}

// Academic Logs
export function logMarksEntry(
  user: string,
  role: UserRole,
  studentName: string,
  subject: string,
  marks: number,
  maxScore: number,
  term?: string,
  year?: string,
  type?: string
): AuditLog {
  return addLog({
    user,
    role,
    action: "GRADE",
    module: "ACADEMICS",
    target: `Student: ${studentName}`,
    ipAddress: getIPAddress(),
    status: "SUCCESS",
    details: {
      studentName,
      subject,
      marks,
      maxScore,
      term,
      year,
      type,
    },
  });
}

export function logMarksUpdate(
  user: string,
  role: UserRole,
  studentName: string,
  subject: string,
  oldMarks: number,
  newMarks: number,
  maxScore: number
): AuditLog {
  return addLog({
    user,
    role,
    action: "UPDATE",
    module: "ACADEMICS",
    target: `Student: ${studentName}`,
    ipAddress: getIPAddress(),
    status: "SUCCESS",
    details: {
      studentName,
      subject,
      oldMarks,
      newMarks,
      maxScore,
      changes: {
        oldMarks,
        newMarks,
      },
    },
  });
}

export function logSubjectAssignment(
  user: string,
  role: UserRole,
  teacherName: string,
  subject: string,
  className: string
): AuditLog {
  return addLog({
    user,
    role,
    action: "ASSIGN",
    module: "ACADEMICS",
    target: `Teacher: ${teacherName}`,
    ipAddress: getIPAddress(),
    status: "SUCCESS",
    details: {
      teacherName,
      subject,
      className,
    },
  });
}

// Discipline Logs
export function logDisciplineIncident(
  user: string,
  role: UserRole,
  studentName: string,
  studentId: string,
  incidentType: string,
  severity: string,
  actionTaken: string,
  marksDeducted?: number,
  oldDisciplineMarks?: number,
  newDisciplineMarks?: number
): AuditLog {
  return addLog({
    user,
    role,
    action: "CREATE",
    module: "DISCIPLINE",
    target: `Student: ${studentName}`,
    targetId: studentId,
    ipAddress: getIPAddress(),
    status: "SUCCESS",
    details: {
      studentName,
      studentId,
      incidentType,
      severity,
      actionTaken,
      marksDeducted,
      oldDisciplineMarks,
      newDisciplineMarks,
    },
  });
}

export function logDisciplineAction(
  user: string,
  role: UserRole,
  studentName: string,
  studentId: string,
  actionType: string,
  details?: Record<string, any>
): AuditLog {
  return addLog({
    user,
    role,
    action: "UPDATE",
    module: "DISCIPLINE",
    target: `Student: ${studentName}`,
    targetId: studentId,
    ipAddress: getIPAddress(),
    status: "SUCCESS",
    details: {
      studentName,
      studentId,
      actionType,
      ...details,
    },
  });
}

// Timetable Logs
export function logTimetableCreate(
  user: string,
  role: UserRole,
  className: string,
  term: string,
  year: string
): AuditLog {
  return addLog({
    user,
    role,
    action: "CREATE",
    module: "TIMETABLE",
    target: `Class: ${className}`,
    ipAddress: getIPAddress(),
    status: "SUCCESS",
    details: {
      className,
      term,
      year,
    },
  });
}

export function logTimetableUpdate(
  user: string,
  role: UserRole,
  className: string,
  slotDetails: Record<string, any>
): AuditLog {
  return addLog({
    user,
    role,
    action: "UPDATE",
    module: "TIMETABLE",
    target: `Class: ${className}`,
    ipAddress: getIPAddress(),
    status: "SUCCESS",
    details: {
      className,
      slotDetails,
    },
  });
}

export function logTimetableConflictOverride(
  user: string,
  role: UserRole,
  className: string,
  conflictDetails: Record<string, any>
): AuditLog {
  return addLog({
    user,
    role,
    action: "OVERRIDE",
    module: "TIMETABLE",
    target: `Class: ${className}`,
    ipAddress: getIPAddress(),
    status: "SUCCESS",
    details: {
      className,
      conflictDetails,
    },
  });
}

// Reports & Exports Logs
export function logReportGenerate(
  user: string,
  role: UserRole,
  reportType: string,
  target: string,
  details?: Record<string, any>
): AuditLog {
  return addLog({
    user,
    role,
    action: "GENERATE",
    module: "REPORTS",
    target,
    ipAddress: getIPAddress(),
    status: "SUCCESS",
    details: {
      reportType,
      ...details,
    },
  });
}

export function logExportData(
  user: string,
  role: UserRole,
  exportType: string,
  format: "CSV" | "Excel" | "PDF",
  recordCount: number
): AuditLog {
  return addLog({
    user,
    role,
    action: "EXPORT",
    module: "REPORTS",
    target: `${exportType} Export`,
    ipAddress: getIPAddress(),
    status: "SUCCESS",
    details: {
      exportType,
      format,
      recordCount,
    },
  });
}

export function logImportData(
  user: string,
  role: UserRole,
  importType: string,
  recordCount: number,
  status: LogStatus
): AuditLog {
  return addLog({
    user,
    role,
    action: "IMPORT",
    module: "REPORTS",
    target: `${importType} Import`,
    ipAddress: getIPAddress(),
    status,
    details: {
      importType,
      recordCount,
    },
  });
}

// Clear old logs (can be called periodically)
export function clearOldLogs(daysToKeep: number = 30): void {
  const logs = getLogs();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const filteredLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate > cutoffDate;
  });

  saveLogs(filteredLogs);
}

// Get logs by module
export function getLogsByModule(module: LogModule): AuditLog[] {
  const logs = getLogs();
  return logs.filter(log => log.module === module);
}

// Get logs by user
export function getLogsByUser(userId: string): AuditLog[] {
  const logs = getLogs();
  return logs.filter(log => log.userId === userId);
}

// Get logs by action
export function getLogsByAction(action: LogAction): AuditLog[] {
  const logs = getLogs();
  return logs.filter(log => log.action === action);
}

// Get logs by date range
export function getLogsByDateRange(startDate: Date, endDate: Date): AuditLog[] {
  const logs = getLogs();
  return logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= startDate && logDate <= endDate;
  });
}
