// Shared student data store
// This data is managed by the admin and accessed by parents, teachers, etc.

export interface Guardian {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
  nationalId: string;
}

export interface Student {
  id: number;
  indexNumber: string;
  name: string;
  gender: string;
  dob: string;
  class: string;
  stream: string;
  admissionDate: string;
  status: string;
  email: string;
  phone: string;
  nationalId: string;
  disciplineMarks: number;
  school?: string;
  grade?: string;
  section?: string;
  photo?: string;
  guardians?: Guardian[];
  subjects?: string[];
}

// Class-subject assignments (admin manages which subjects are taught in each class)
export interface ClassSubjectAssignment {
  class: string;
  stream: string;
  subjects: string[];
}

export const classSubjectAssignments: ClassSubjectAssignment[] = [
  { class: "Form 1", stream: "Science", subjects: ["Mathematics", "Physics", "Chemistry", "English", "Biology"] },
  { class: "Form 1", stream: "Arts", subjects: ["English", "History", "Geography", "Mathematics", "Literature"] },
  { class: "Form 1", stream: "Commerce", subjects: ["Mathematics", "Economics", "Accounting", "English", "Business Studies"] },
  { class: "Form 2", stream: "Science", subjects: ["Mathematics", "Physics", "Chemistry", "English", "Biology"] },
  { class: "Form 2", stream: "Arts", subjects: ["English", "History", "Geography", "Mathematics", "Literature"] },
  { class: "Form 2", stream: "Commerce", subjects: ["Mathematics", "Economics", "Accounting", "English", "Business Studies"] },
  { class: "Form 3", stream: "Science", subjects: ["Mathematics", "Physics", "Chemistry", "English", "Biology"] },
  { class: "Form 3", stream: "Commerce", subjects: ["Mathematics", "Economics", "Accounting", "English", "Business Studies"] },
  { class: "Form 4", stream: "Science", subjects: ["Mathematics", "Physics", "Chemistry", "English", "Biology"] },
  { class: "Form 4", stream: "Commerce", subjects: ["Mathematics", "Economics", "Accounting", "English", "Business Studies"] },
  { class: "Form 5", stream: "Science", subjects: ["Mathematics", "Physics", "Chemistry", "English", "Biology"] },
  { class: "Form 5", stream: "Arts", subjects: ["English", "History", "Geography", "Mathematics", "Literature"] },
  { class: "Form 6", stream: "Science", subjects: ["Mathematics", "Physics", "Chemistry", "English", "Biology"] },
  { class: "Form 6", stream: "Commerce", subjects: ["Mathematics", "Economics", "Accounting", "English", "Business Studies"] },
];

// Function to get subjects for a specific class and stream
export function getSubjectsForClass(studentClass: string, stream: string): string[] {
  const assignment = classSubjectAssignments.find(
    a => a.class === studentClass && a.stream === stream
  );
  return assignment?.subjects || [];
}

export const studentsData: Student[] = [
  { 
    id: 1, 
    indexNumber: "STU-001", 
    name: "Alice Johnson", 
    gender: "Female", 
    dob: "2010-05-15", 
    class: "Form 1", 
    stream: "Science", 
    admissionDate: "2025-01-15", 
    status: "Active", 
    email: "alice@school.com", 
    phone: "+1234567890", 
    nationalId: "NID123456", 
    disciplineMarks: 40, 
    school: "SMS High School", 
    grade: "Grade 10", 
    section: "A",
    guardians: [
      {
        id: "G001",
        name: "Robert Johnson",
        relationship: "Father",
        phone: "+1234567890",
        email: "robert.johnson@email.com",
        address: "123 Main Street, City",
        nationalId: "NID999999"
      },
      {
        id: "G002",
        name: "Mary Johnson",
        relationship: "Mother",
        phone: "+1234567891",
        email: "mary.johnson@email.com",
        address: "123 Main Street, City",
        nationalId: "NID998888"
      }
    ]
  },
  { 
    id: 2, 
    indexNumber: "STU-002", 
    name: "Brian Smith", 
    gender: "Male", 
    dob: "2009-08-22", 
    class: "Form 1", 
    stream: "Science", 
    admissionDate: "2025-01-15", 
    status: "Active", 
    email: "brian@school.com", 
    phone: "+1234567891", 
    nationalId: "NID123457", 
    disciplineMarks: 38, 
    school: "SMS High School", 
    grade: "Grade 10", 
    section: "A",
    guardians: [
      {
        id: "G003",
        name: "Robert Johnson",
        relationship: "Father",
        phone: "+1234567890",
        email: "robert.johnson@email.com",
        address: "123 Main Street, City",
        nationalId: "NID999999"
      }
    ]
  },
  { id: 3, indexNumber: "STU-003", name: "Carol Davis", gender: "Female", dob: "2010-03-10", class: "Form 2", stream: "Arts", admissionDate: "2024-01-15", status: "Active", email: "carol@school.com", phone: "+1234567892", nationalId: "NID123458", disciplineMarks: 35, school: "SMS High School", grade: "Grade 9", section: "B" },
  { id: 4, indexNumber: "STU-004", name: "David Wilson", gender: "Male", dob: "2009-11-05", class: "Form 2", stream: "Arts", admissionDate: "2024-01-15", status: "Active", email: "david@school.com", phone: "+1234567893", nationalId: "NID123459", disciplineMarks: 40, school: "SMS High School", grade: "Grade 9", section: "B" },
  { id: 5, indexNumber: "STU-005", name: "Emma Brown", gender: "Female", dob: "2008-07-18", class: "Form 3", stream: "Science", admissionDate: "2023-01-15", status: "Active", email: "emma@school.com", phone: "+1234567894", nationalId: "NID123460", disciplineMarks: 30, school: "SMS High School", grade: "Grade 8", section: "A" },
  { id: 6, indexNumber: "STU-006", name: "Frank Miller", gender: "Male", dob: "2008-02-28", class: "Form 3", stream: "Commerce", admissionDate: "2023-01-15", status: "Suspended", email: "frank@school.com", phone: "+1234567895", nationalId: "NID123461", disciplineMarks: 5, school: "SMS High School", grade: "Grade 8", section: "C" },
  { id: 7, indexNumber: "STU-007", name: "Grace Lee", gender: "Female", dob: "2007-09-12", class: "Form 4", stream: "Science", admissionDate: "2022-01-15", status: "Active", email: "grace@school.com", phone: "+1234567896", nationalId: "NID123462", disciplineMarks: 37, school: "SMS High School", grade: "Grade 7", section: "A" },
  { id: 8, indexNumber: "STU-008", name: "Henry Taylor", gender: "Male", dob: "2007-04-30", class: "Form 4", stream: "Commerce", admissionDate: "2022-01-15", status: "Active", email: "henry@school.com", phone: "+1234567897", nationalId: "NID123463", disciplineMarks: 40, school: "SMS High School", grade: "Grade 7", section: "C" },
  { id: 9, indexNumber: "STU-009", name: "Isabella Martinez", gender: "Female", dob: "2006-12-08", class: "Form 5", stream: "Science", admissionDate: "2021-01-15", status: "Active", email: "isabella@school.com", phone: "+1234567898", nationalId: "NID123464", disciplineMarks: 32, school: "SMS High School", grade: "Grade 6", section: "A" },
  { id: 10, indexNumber: "STU-010", name: "Jack Anderson", gender: "Male", dob: "2006-06-25", class: "Form 5", stream: "Arts", admissionDate: "2021-01-15", status: "Active", email: "jack@school.com", phone: "+1234567899", nationalId: "NID123465", disciplineMarks: 28, school: "SMS High School", grade: "Grade 6", section: "B" },
  { id: 11, indexNumber: "STU-011", name: "Kate Thompson", gender: "Female", dob: "2005-10-14", class: "Form 6", stream: "Science", admissionDate: "2020-01-15", status: "Graduated", email: "kate@school.com", phone: "+1234567800", nationalId: "NID123466", disciplineMarks: 40, school: "SMS High School", grade: "Grade 5", section: "A" },
  { id: 12, indexNumber: "STU-012", name: "Liam Garcia", gender: "Male", dob: "2005-03-22", class: "Form 6", stream: "Commerce", admissionDate: "2020-01-15", status: "Active", email: "liam@school.com", phone: "+1234567801", nationalId: "NID123467", disciplineMarks: 35, school: "SMS High School", grade: "Grade 5", section: "C" },
];

// Parent-Student mapping (which parent is linked to which students)
export interface ParentStudentLink {
  parentId: string;
  parentName: string;
  studentIds: number[];
}

export const parentStudentLinks: ParentStudentLink[] = [
  {
    parentId: "P001",
    parentName: "Robert Johnson",
    studentIds: [1, 2] // Alice Johnson (STU-001) and Brian Smith (STU-002)
  }
];

// Function to get students for a specific parent
export function getStudentsForParent(parentName: string): Student[] {
  const link = parentStudentLinks.find(l => l.parentName === parentName);
  if (!link) return [];
  return studentsData.filter(s => link.studentIds.includes(s.id));
}
