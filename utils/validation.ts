/**
 * Validation utilities for user input
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRollNumber = (rollNumber: string): boolean => {
  // Allow format like 22AI101, 23CS001, etc.
  return /^[0-9]{2}[A-Z]{2,4}[0-9]{3,4}$/.test(rollNumber.trim());
};

export const validateName = (name: string): boolean => {
  // Allow letters, spaces, and common punctuation
  return /^[a-zA-Z\s'-]{2,100}$/.test(name.trim());
};

export const validatePassword = (password: string): boolean => {
  // Minimum 6 characters
  return password.length >= 6;
};

export const validateScore = (score: number, maxScore: number): boolean => {
  return score >= 0 && score <= maxScore;
};

export const sanitizeInput = (input: string): string => {
  // Remove leading/trailing whitespace and basic HTML/script tags
  return input
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .slice(0, 200); // Limit to 200 characters
};

export const validateSubjectCode = (code: string): boolean => {
  // Format: CSC401, CSL405, etc.
  return /^[A-Z]{2,3}[0-9]{3,4}$/.test(code.trim());
};

export const validateDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};
