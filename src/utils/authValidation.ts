const STUDENT_EMAIL_PATTERN = /^\d{8}@spcba\.edu\.ph$/i;
const FACULTY_EMAIL_PATTERN = /^\d{8}@spcba\.faculty\.ph$/i;
const REPEATED_DIGIT_ID_PATTERN = /^(\d)\1{7}$/;

export const getRoleFromEmail = (value: string): 'student' | 'faculty' | null => {
  const email = value.trim();
  const [localPart = ''] = email.split('@');

  if (FACULTY_EMAIL_PATTERN.test(email) || (STUDENT_EMAIL_PATTERN.test(email) && REPEATED_DIGIT_ID_PATTERN.test(localPart))) {
    return 'faculty';
  }
  if (STUDENT_EMAIL_PATTERN.test(email)) return 'student';
  return null;
};

export const validateSpcbaEmail = (value: string): string | null => {
  if (!value.trim()) return 'Email is required';
  return getRoleFromEmail(value)
    ? null
    : 'Use your 8-digit SPCBA email, like 12345678@spcba.edu.ph or 12345678@spcba.faculty.ph';
};
