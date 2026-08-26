// Centralized user-facing error strings.
// Raw backend messages never reach UI.

export const ERROR_MESSAGES = {
  NETWORK_FAILURE: 'Unable to connect. Please check your internet connection and try again.',
  INVALID_CREDENTIALS: 'Incorrect email or password. Please try again.',
  TOO_MANY_ATTEMPTS: 'Too many login attempts. Please wait a few minutes before trying again.',
  EMAIL_NOT_CONFIRMED: 'Please verify your email before signing in. Check your inbox for the verification link.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_SPCBA_EMAIL: 'Please enter a valid SPCBA email address.',
  INVALID_INPUT: 'Please check your input and try again.',
  STORAGE_FAILURE: 'Unable to access saved data right now. Please try again.',
  DATABASE_FAILURE: 'Unable to load data right now. Please try again later.',
  SERVER_ERROR: 'Something went wrong. Please try again or contact the IT department if the problem persists.',
  ORIGINALITY_CHECK_FAILED: 'Analysis could not complete. Please try again or contact support.',
  CITATION_ERROR: 'Unable to generate citation. Please try again.',
  BOOKMARK_ERROR: 'Unable to save bookmark. Please try again.',
  MESSAGE_SEND_FAILED: 'Failed to send message. Please check your connection and try again.',
} as const;

type ErrorLike = {
  code?: string;
  message?: string;
  name?: string;
  status?: number;
};

const normalizeError = (error: unknown): ErrorLike => {
  if (!error || typeof error !== 'object') {
    return {};
  }

  return error as ErrorLike;
};

export function getErrorMessage(error: unknown): string {
  const { code, message = '', status, name } = normalizeError(error);
  const lowerMessage = message.toLowerCase();

  if (
    status === 0 ||
    code === 'ERR_NETWORK' ||
    lowerMessage.includes('network') ||
    lowerMessage.includes('fetch') ||
    lowerMessage.includes('failed to fetch')
  ) {
    return ERROR_MESSAGES.NETWORK_FAILURE;
  }

  if (
    status === 400 &&
    (lowerMessage.includes('invalid login') || lowerMessage.includes('invalid credentials'))
  ) {
    return ERROR_MESSAGES.INVALID_CREDENTIALS;
  }

  if (status === 429 || lowerMessage.includes('too many requests')) {
    return ERROR_MESSAGES.TOO_MANY_ATTEMPTS;
  }

  if (lowerMessage.includes('email not confirmed')) {
    return ERROR_MESSAGES.EMAIL_NOT_CONFIRMED;
  }

  if (
    lowerMessage.includes('session') &&
    (lowerMessage.includes('expired') || lowerMessage.includes('missing'))
  ) {
    return ERROR_MESSAGES.SESSION_EXPIRED;
  }

  if (
    status === 422 ||
    lowerMessage.includes('@spcba.edu.ph') ||
    lowerMessage.includes('institutional email')
  ) {
    return ERROR_MESSAGES.INVALID_SPCBA_EMAIL;
  }

  if (lowerMessage.includes('invalid email')) {
    return ERROR_MESSAGES.INVALID_EMAIL;
  }

  if (name === 'StorageError' || lowerMessage.includes('storage')) {
    return ERROR_MESSAGES.STORAGE_FAILURE;
  }

  if (
    lowerMessage.includes('relation') ||
    lowerMessage.includes('column') ||
    lowerMessage.includes('database')
  ) {
    return ERROR_MESSAGES.DATABASE_FAILURE;
  }

  return ERROR_MESSAGES.SERVER_ERROR;
}
