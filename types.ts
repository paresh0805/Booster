
export enum AssessmentType {
  IA1 = 'Internal Assessment 1',
  IA2 = 'Internal Assessment 2',
  TW = 'Term Work',
  ESE = 'End Semester Exam',
  ORAL_PRAC = 'Oral & Practical'
}

export interface Student {
  id: string; // Roll Number
  name: string;
  classId: string; // e.g., SE-AIML-B
  major: string;
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
}

export interface ScoreEntry {
  studentId: string;
  subject: string;
  type: AssessmentType;
  score: number;
  maxScore: number;
  date: string;
  credits: number;
}

export interface Subject {
  id: string;
  name: string;
  credits: number;
  code: string;
}

export type Role = 'teacher' | 'student';

export interface PerformanceAnalysis {
  summary: string;
  recommendations: string[];
  careerPath: string;
}
