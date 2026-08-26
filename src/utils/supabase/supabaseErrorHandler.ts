import { ERROR_MESSAGES, getErrorMessage } from '@/utils/errorMessages';

export const mapAuthError = (error: unknown): string => {
  return getErrorMessage(error);
};

export const mapStorageError = (error: unknown): string => {
  const message = getErrorMessage(error);
  return message === ERROR_MESSAGES.SERVER_ERROR ? ERROR_MESSAGES.STORAGE_FAILURE : message;
};

export const mapDatabaseError = (error: unknown): string => {
  const message = getErrorMessage(error);
  return message === ERROR_MESSAGES.SERVER_ERROR ? ERROR_MESSAGES.DATABASE_FAILURE : message;
};

// Keep the original function for backward compatibility but update it to use the mapper
export const handleSupabaseError = (error: unknown): string => {
  return mapAuthError(error);
};

export const isSupabaseError = (error: unknown): boolean => {
  return Boolean(error && typeof error === 'object' && 'message' in error);
};
