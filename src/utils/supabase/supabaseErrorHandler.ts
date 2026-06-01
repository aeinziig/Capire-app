export const handleSupabaseError = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  return 'An unknown error occurred';
};

export const isSupabaseError = (error: any): boolean => {
  return error && typeof error === 'object' && 'code' in error && 'message' in error;
};