import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  studentLogin: (credentials: { student_id: string, full_name: string }) => api.post('/auth/student-login', credentials),
};

export const academicApi = {
  // Years
  getYears: () => api.get('/academics/years'),
  addYear: (name: string) => api.post('/academics/years', { name }),

  // Terms
  getTerms: () => api.get('/academics/terms'),
  addTerm: (data: any) => api.post('/academics/terms', data),

  // Classes & Streams
  getClasses: () => api.get('/academics/classes'),
  addClass: (name: string) => api.post('/academics/classes', { name }),
  getStreams: () => api.get('/academics/streams'),
  addStream: (classId: number, name: string) => api.post('/academics/streams', { class_id: classId, name }),

  // Subjects
  getSubjects: () => api.get('/academics/subjects'),
  addSubject: (data: any) => api.post('/academics/subjects', data),
};

export const peopleApi = {
  // Teachers
  getTeachers: () => api.get('/teachers'),
  getTeacherById: (id: number) => api.get(`/teachers/${id}`),
  getTeacherMe: () => api.get('/teachers/me'),
  addTeacher: (data: any) => api.post('/teachers', data),
  assignClasses: (teacherId: number, data: { subjects: string[], classes: string[], streams?: number[] }) => api.post(`/teachers/${teacherId}/assignments`, data),

  // Students
  getStudents: (className?: string) => api.get('/students', { params: className ? { class_name: className } : undefined }),
  addStudent: (data: any) => api.post('/students', data),
};

export const recordApi = {
  saveMarks: (data: any) => api.post('/marks', data),
  getMarks: (studentId: number) => api.get(`/marks/student/${studentId}`),
  getStudentMarks: (studentId: string) => api.get(`/marks/student/${studentId}`),
  getClassMarks: (classId: number, params?: any) => api.get(`/marks/class/${classId}`, { params }),
};

export const disciplineApi = {
  getIncidents: () => api.get('/discipline'),
  getStudentIncidents: (studentId: number) => api.get(`/discipline/student/${studentId}`),
  createIncident: (data: any) => api.post('/discipline', data),
  deductMarks: (data: { student_id: number; subject_id?: number; points: number; reason: string; category: string; date: string }) =>
    api.post('/discipline', {
      student_id: data.student_id,
      description: data.reason,
      punishment_marks: data.points,
      date: data.date,
    }),
};

export const notificationsApi = {
  getMyNotifications: () => api.get('/notifications/my'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id: number) => api.patch(`/notifications/${id}/read`),
};

export const statsApi = {
  getDashboardStats: () => api.get('/dashboard/stats'),
};

export default api;
