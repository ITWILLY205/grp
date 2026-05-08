import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AttendanceRecord {
  studentId: number;
  studentName: string;
  status: 'present' | 'absent' | 'late';
}

export interface AttendanceSession {
  id: string;
  date: string;
  classLevel: string;
  term: string;
  records: AttendanceRecord[];
  recordedBy: string;
}

interface AttendanceStore {
  sessions: AttendanceSession[];
  saveSession: (session: Omit<AttendanceSession, 'id'>) => void;
}

export const useAttendanceStore = create<AttendanceStore>()(
  persist(
    (set) => ({
      sessions: [],
      saveSession: (session) => set((state) => ({
        sessions: [
          ...state.sessions,
          {
            ...session,
            id: Math.random().toString(36).substring(2, 9),
          }
        ]
      })),
    }),
    {
      name: 'attendance-storage',
    }
  )
);
