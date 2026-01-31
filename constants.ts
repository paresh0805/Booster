
import { AssessmentType, Student, Subject, ScoreEntry, Faculty } from './types';

export const SUBJECTS: Subject[] = [
  { id: 'maths4', name: 'Engineering Mathematics-IV', code: 'CSC401', credits: 4 },
  { id: 'aoa', name: 'Analysis of Algorithms', code: 'CSC402', credits: 3 },
  { id: 'dbms', name: 'Database Management System', code: 'CSC403', credits: 3 },
  { id: 'os', name: 'Operating System', code: 'CSC404', credits: 3 },
  { id: 'mpmc', name: 'Microprocessor & Microcontroller', code: 'CSC405', credits: 3 },
  { id: 'python', name: 'Skill Lab: Python Programming', code: 'CSL405', credits: 2 }
];

export const MOCK_FACULTY: Faculty[] = [
  { id: 'F001', name: 'Dr. Sameer Patil', department: 'AI & Data Science' },
  { id: 'F002', name: 'Prof. Anjali Deshmukh', department: 'Computer Engineering' },
  { id: 'F003', name: 'Dr. Vikram Seth', department: 'IT Department' }
];

export const MOCK_STUDENTS: Student[] = [
  { id: '22AI101', name: 'Aditya Kulkarni', classId: 'SE-AIML-A', major: 'AI & Machine Learning' },
  { id: '22AI102', name: 'Siddhi Sawant', classId: 'SE-AIML-A', major: 'AI & Machine Learning' },
  { id: '22AI103', name: 'Rohan Mehta', classId: 'SE-AIML-B', major: 'AI & Machine Learning' },
  { id: '22AI104', name: 'Ishani Gupta', classId: 'SE-AIML-A', major: 'AI & Machine Learning' },
  { id: '22AI105', name: 'Kabir Singh', classId: 'SE-AIML-A', major: 'AI & Machine Learning' },
  { id: '22AI106', name: 'Meera Nair', classId: 'SE-AIML-B', major: 'AI & Machine Learning' },
  { id: '22AI107', name: 'Aman Verma', classId: 'SE-AIML-B', major: 'AI & Machine Learning' },
  { id: '22AI108', name: 'Zara Khan', classId: 'SE-AIML-A', major: 'AI & Machine Learning' },
  { id: '22AI109', name: 'Neil D’Souza', classId: 'SE-AIML-B', major: 'AI & Machine Learning' },
  { id: '22AI110', name: 'Pooja Bhatt', classId: 'SE-AIML-A', major: 'AI & Machine Learning' }
];

export const INITIAL_SCORES: ScoreEntry[] = [
  // Aditya Kulkarni - Elite Performer (>85%)
  { studentId: '22AI101', subject: 'Engineering Mathematics-IV', type: AssessmentType.IA1, score: 19, maxScore: 20, date: '2024-02-15', credits: 4 },
  { studentId: '22AI101', subject: 'Analysis of Algorithms', type: AssessmentType.IA1, score: 18, maxScore: 20, date: '2024-02-16', credits: 3 },
  { studentId: '22AI101', subject: 'Database Management System', type: AssessmentType.IA1, score: 19, maxScore: 20, date: '2024-02-17', credits: 3 },
  { studentId: '22AI101', subject: 'Engineering Mathematics-IV', type: AssessmentType.TW, score: 24, maxScore: 25, date: '2024-04-10', credits: 4 },
  { studentId: '22AI101', subject: 'Skill Lab: Python Programming', type: AssessmentType.ORAL_PRAC, score: 48, maxScore: 50, date: '2024-04-15', credits: 2 },
  
  // Siddhi Sawant
  { studentId: '22AI102', subject: 'Analysis of Algorithms', type: AssessmentType.IA1, score: 12, maxScore: 20, date: '2024-02-16', credits: 3 },
  { studentId: '22AI102', subject: 'Operating System', type: AssessmentType.IA1, score: 15, maxScore: 20, date: '2024-02-18', credits: 3 }
];
