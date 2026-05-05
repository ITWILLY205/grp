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
const teachers: Teacher[] = [
  { id: "TCH-001", firstName: "John", lastName: "Mugabo", email: "john@school.com", modules: ["Mathematics", "Physics"], department: "Mathematics" },
  { id: "TCH-002", firstName: "Sarah", lastName: "Uwimana", email: "sarah@school.com", modules: ["Physics", "Chemistry"], department: "Science" },
  { id: "TCH-003", firstName: "David", lastName: "Habimana", email: "david@school.com", modules: ["Chemistry", "Biology"], department: "Science" },
  { id: "TCH-004", firstName: "Grace", lastName: "Mukamana", email: "grace@school.com", modules: ["Biology"], department: "Science" },
  { id: "TCH-005", firstName: "Peter", lastName: "Niyonsaba", email: "peter@school.com", modules: ["English", "History"], department: "Languages" },
  { id: "TCH-006", firstName: "Marie", lastName: "Iradukunda", email: "marie@school.com", modules: ["History", "Geography"], department: "Arts" },
  { id: "TCH-007", firstName: "James", lastName: "Nshuti", email: "james@school.com", modules: ["Geography", "Computer Science"], department: "Arts" },
];

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
