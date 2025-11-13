import { z } from 'zod';

/**
 * Zod schema for vacation preferences validation
 */
export const VacationPreferencesSchema = z.object({
  description: z.string()
    .min(10, 'Please provide at least 10 characters describing your ideal vacation')
    .max(500, 'Description too long (maximum 500 characters)'),
  budget: z.number()
    .min(500, 'Minimum budget is $500')
    .max(100000, 'Maximum budget is $100,000')
    .int('Budget must be a whole number'),
  duration: z.number()
    .min(1, 'Minimum duration is 1 day')
    .max(30, 'Maximum duration is 30 days')
    .int('Duration must be a whole number'),
  travelers: z.number()
    .min(1, 'At least 1 traveler required')
    .max(10, 'Maximum 10 travelers allowed')
    .int('Number of travelers must be a whole number'),
  departureCity: z.string().optional(),
  month: z.string().optional(),
  interests: z.array(z.string()).optional(),
});

export type ValidatedPreferences = z.infer<typeof VacationPreferencesSchema>;

/**
 * Validate vacation preferences
 * @param prefs - Preferences to validate
 * @returns Validation result with data or errors
 */
export function validatePreferences(prefs: unknown) {
  return VacationPreferencesSchema.safeParse(prefs);
}

/**
 * Sanitize user input to prevent XSS attacks
 * @param input - Raw user input
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove potentially dangerous HTML tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    // Remove HTML tags but keep content
    .replace(/<[^>]*>/g, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove on* event handlers
    .replace(/on\w+\s*=/gi, '');
}

/**
 * Validate and sanitize email address
 * @param email - Email to validate
 * @returns Validation result
 */
export function validateEmail(email: string): { valid: boolean; message?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || email.trim().length === 0) {
    return { valid: false, message: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  
  if (email.length > 254) {
    return { valid: false, message: 'Email address is too long' };
  }
  
  return { valid: true };
}

/**
 * Validate credit card number (basic Luhn algorithm)
 * @param cardNumber - Card number to validate
 * @returns Validation result
 */
export function validateCardNumber(cardNumber: string): { valid: boolean; message?: string } {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  
  // Check if it's all digits
  if (!/^\d+$/.test(cleaned)) {
    return { valid: false, message: 'Card number must contain only digits' };
  }
  
  // Check length (most cards are 13-19 digits)
  if (cleaned.length < 13 || cleaned.length > 19) {
    return { valid: false, message: 'Card number must be between 13 and 19 digits' };
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 !== 0) {
    return { valid: false, message: 'Invalid card number' };
  }
  
  return { valid: true };
}

/**
 * Validate CVV
 * @param cvv - CVV to validate
 * @returns Validation result
 */
export function validateCVV(cvv: string): { valid: boolean; message?: string } {
  const cleaned = cvv.trim();
  
  if (!/^\d{3,4}$/.test(cleaned)) {
    return { valid: false, message: 'CVV must be 3 or 4 digits' };
  }
  
  return { valid: true };
}

/**
 * Validate expiry date (MM/YY format)
 * @param expiry - Expiry date string
 * @returns Validation result
 */
export function validateExpiry(expiry: string): { valid: boolean; message?: string } {
  const cleaned = expiry.replace(/\s/g, '');
  
  // Check format MM/YY or MM/YYYY
  const match = cleaned.match(/^(\d{2})\/(\d{2}|\d{4})$/);
  
  if (!match) {
    return { valid: false, message: 'Expiry must be in MM/YY format' };
  }
  
  const month = parseInt(match[1], 10);
  let year = parseInt(match[2], 10);
  
  // Validate month
  if (month < 1 || month > 12) {
    return { valid: false, message: 'Invalid month' };
  }
  
  // Convert 2-digit year to 4-digit
  if (year < 100) {
    year += 2000;
  }
  
  // Check if expired
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { valid: false, message: 'Card has expired' };
  }
  
  // Check if too far in future (more than 20 years)
  if (year > currentYear + 20) {
    return { valid: false, message: 'Invalid expiry year' };
  }
  
  return { valid: true };
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  /**
   * Check if action is allowed
   * @param key - Unique identifier for the action
   * @param maxAttempts - Maximum attempts allowed
   * @param windowMs - Time window in milliseconds
   * @returns Whether action is allowed
   */
  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }
  
  /**
   * Reset attempts for a key
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Export singleton rate limiter
export const rateLimiter = new RateLimiter();
