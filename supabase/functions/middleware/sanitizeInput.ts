// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http.server.ts'

/**
 * Sanitize input to prevent XSS attacks when outputting to HTML
 * @param input The string to sanitize
 * @returns Sanitized string safe for HTML output
 */
export function sanitizeHtml(input: string): string {
  if (!input) return input;

  return input
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#x60;');
}

/**
 * Validate Base64 string
 * @param input The string to validate
 * @returns True if valid Base64 format
 */
export function isValidBase64(input: string): boolean {
  if (!input) return false;
  // Base64 regex - allows padding with =
  const base64Regex = /^[A-Za-z0-9\/+]+=*$/;
  return base64Regex.test(input);
}

/**
 * Validate email format
 * @param email The email to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param password The password to validate
 * @returns Object with isValid boolean and optional error message
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: 'Payment is required' };
  }
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }
  return { isValid: true };
}

/**
 * Validate username/display name
 * @param name The name to validate
 * @returns Object with isValid boolean and optional error message
 */
export function validateName(name: string): { isValid: boolean; error?: string } {
  if (!name) {
    return { isValid: false, error: 'Name is required' };
  }
  if (name.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  if (name.length > 50) {
    return { isValid: false, error: 'Name must not exceed 50 characters' };
  }
  // Allow letters, numbers, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z0-9\s\-']+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, error: 'Name can only contain letters, numbers, spaces, hyphens, and apostrophes' };
  }
  return { isValid: true };
}