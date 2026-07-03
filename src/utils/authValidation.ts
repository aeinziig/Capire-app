const SPCBA_EMAIL_PATTERN = /^\d{8}@spcba\.edu\.ph$/i;

export const validateSpcbaEmail = (value: string): string | null => {
  const email = value.trim();

  if (!email) {
    return 'Email is required';
  }

  return SPCBA_EMAIL_PATTERN.test(email) ? null : 'Use your 8-digit SPCBA email, like 12345678@spcba.edu.ph';
};
