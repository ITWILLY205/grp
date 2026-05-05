import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  login: (credentials: any) => api.post('/login', credentials),
  studentLogin: (credentials: { student_id: string, full_name: string }) => api.post('/student-login', credentials),
};

export const academicApi = {
  // Years
  getYears: () => api.get('/academic-years'),
  addYear: (name: string) => api.post('/academic-years', { name }),
  
  // Terms
  getTerms: () => api.get('/terms'),
  addTerm: (data: any) => api.post('/terms', data),
  
  // Classes & Streams
  getClasses: () => api.get('/classes'),
  addClass: (name: string) => api.post('/classes', { name }),
  getStreams: () => api.get('/streams'),
  
  // Subjects
  getSubjects: () => api.get('/subjects'),
};

export const peopleApi = {
  // Teachers
  getTeachers: () => api.get('/teachers'),
  addTeacher: (data: any) => api.post('/teachers', data),
  
  // Students
  getStudents: () => api.get('/students'),
  addStudent: (data: any) => api.post('/students', data),
};

export const recordApi = {
  saveMarks: (data: any) => api.post('/marks', data),
  getMarks: (studentId: number) => api.get(`/marks/${studentId}`),
  getStudentMarks: (studentId: string) => api.get(`/marks/${studentId}`),
};

export const disciplineApi = {
  deductMarks: (data: { student_id: number; subject_id?: number; points: number; reason: string; category: string; date: string }) =>
    api.post('/discipline/deduct', data),
};

export const notificationsApi = {
  getForUser: (userId: number) => api.get(`/notifications/${userId}`),
};

export const statsApi = {
  getDashboardStats: () => api.get('/dashboard/stats'),
};

export default api;
