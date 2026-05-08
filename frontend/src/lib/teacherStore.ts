// Simple in-memory store for teacher data
// In a real app, this would come from a backend/API

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  modules: string[]; // subjects assigned by admin
  department: string;
}

// Sample teachers with their assigned modules (subjects)
const teachers: Teacher[] = [];

// Simulate the currently logged-in teacher
// In a real app, this would be determined by auth/session
let currentTeacherId = "TCH-001";

export function getCurrentTeacher(): Teacher {
  return teachers.find(t => t.id === currentTeacherId) || teachers[0];
}

export function setCurrentTeacherId(id: string): void {
  currentTeacherId = id;
}

export function getTeacherSubjects(): string[] {
  return getCurrentTeacher().modules;
}

export function getAllTeachers(): Teacher[] {
  return teachers;
}
