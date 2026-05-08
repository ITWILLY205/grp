import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Permission {
  id: string;
  studentName: string;
  classLevel: string;
  reason: string;
  dateOut: string;
  dateIn: string;
  address: string;
  parentNumber: string;
  status: 'pending' | 'active' | 'returned' | 'overdue';
  notified: boolean;
  term: string;
}

interface PermissionStore {
  permissions: Permission[];
  addPermission: (permission: Omit<Permission, 'id' | 'status' | 'notified'>) => void;
  updatePermissionStatus: (id: string, status: Permission['status']) => void;
  markAsNotified: (id: string) => void;
  getOverduePermissions: () => Permission[];
}

export const usePermissionStore = create<PermissionStore>()(
  persist(
    (set, get) => ({
      permissions: [],
      addPermission: (permission) => set((state) => ({
        permissions: [
          ...state.permissions,
          {
            ...permission,
            id: Math.random().toString(36).substring(2, 9),
            status: 'active',
            notified: false,
          }
        ]
      })),
      updatePermissionStatus: (id, status) => set((state) => ({
        permissions: state.permissions.map(p => p.id === id ? { ...p, status } : p)
      })),
      markAsNotified: (id) => set((state) => ({
        permissions: state.permissions.map(p => p.id === id ? { ...p, notified: true } : p)
      })),
      getOverduePermissions: () => {
        const now = new Date();
        return get().permissions.filter(p => 
          p.status === 'active' && 
          new Date(p.dateIn) <= now && 
          !p.notified
        );
      }
    }),
    {
      name: 'permission-storage',
    }
  )
);
