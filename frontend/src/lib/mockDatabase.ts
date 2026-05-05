export interface Student {
  id: number;
  indexNumber: string;
  name: string;
  gender: string;
  dob: string;
  class: string;
  combination: string;
  admissionDate: string;
  status: string;
  email: string;
  phone: string;
  nationalId: string;
  disciplineMarks: number;
  photo?: string;
  address?: string;
  city?: string;
  district?: string;
  nationality?: string;
  religion?: string;
  bloodGroup?: string;
  previousSchool?: string;
  guardianName?: string;
  guardianRelation?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  guardianIdCard?: string;
  guardianOccupation?: string;
  fatherName?: string;
  fatherPhone?: string;
  fatherEmail?: string;
  fatherIdCard?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherPhone?: string;
  motherEmail?: string;
  motherIdCard?: string;
  motherOccupation?: string;
  academicYear: string;
  username?: string;
  password?: string;
}

// Cleared for production use
export const studentsData: Student[] = [];
